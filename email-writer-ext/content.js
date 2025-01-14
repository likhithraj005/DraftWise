console.log("Email Writer Extension - Content Script Loaded");

function findComposeToolbar(){
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];

    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) return toolbar;
    }
    return null;
}

function getEmailContent(){
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];

    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            console.log(`Found email content for selector: ${selector}`);
            return content.innerText.trim();
        }

        const emailContent = getEmailContent();
        if (!emailContent) {
            alert("No email content found to draft a reply.");
            return;
        }
        console.log('Fetching email content:', emailContent);
    }
    return '';
}

// function createAIButton(){
//     const button = document.createElement('div');
//     button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
//     button.style.marginRight = '8px';
//     button.innerHTML = 'Draft AI';
//     button.setAttribute('role', 'button');
//     button.setAttribute('data-tooltip', 'Draft AI');
//     return button;
// }

// function injectButton(){
//     const existingButton = document.querySelector('.ai-reply-button');
//     if (existingButton) existingButton.remove();

//     const toolbar = findComposeToolbar();
//     if (!toolbar) {
//         console.error("Compose toolbar not found");
//         return;
//     }
//     console.log("Compose toolbar found, injecting button");

//     const button = createAIButton();
//     button.classList.add('ai-reply-button');


//     button.addEventListener('click', async () => {
//         try {
//             button.innerHTML = 'Drafting...';
//             button.disabled = true;

//             const emailContent = getEmailContent();
//             console.log('Fetching email content:', emailContent);

//             const response = await fetch('http://localhost:8080/api/email/generate', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ 
//                     emailContent : emailContent,
//                     tone : "professional"
//                 })
//             })

//             if (!response.ok) {
//                 throw new Error('API request failed');
//             }

//             const generatedReply = await response.text();
//             if (!generatedReply) {
//                 alert('Generated reply is empty!');
//                 return;
//             }
//             console.log('Generated reply:', generatedReply);

//             const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
//             if (composeBox) {
//                 composeBox.focus();
//                 document.execCommand('insertText', false, generatedReply);
//             } else {
//                 console.error('Compose box was not found');   
//             }
//         } catch (error) {
//             console.error(error);
//             alert('Failed to generate reply');
//         }finally{
//             button.innerHTML = 'Draft AI';
//             button.disabled = false;
//         }
//     });

//     toolbar.insertBefore(button, toolbar.firstChild);

// }


function createAIButton(){
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.innerHTML = 'Draft AI';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Draft AI');
    return button;
}

function createToneDropdown() {
    const dropdown = document.createElement('select');
    dropdown.className = 'tone-dropdown T-I J-J5-Ji aoO v7 T-I-atl L3'; // Same classes as button
    dropdown.style.marginRight = '8px';
    // dropdown.style.backgroundColor = '#f1f3f4'; // Ensure background color matches the button
    // dropdown.style.border = '1px solid #dadce0'; // Border color to match the button
    // dropdown.style.padding = '0 12px'; // Padding to match the button

    const tones = ['None', 'Formal', 'Informal', 'Friendly', 'Swaggy', 'Professional', 'Casual', 'Urgent', 'Apologetic', 'Appreciative', 'Sympathetic', 'Confident', 'Confused', 'Excited']

    tones.forEach(tone => {
        const option = document.createElement('option');
        option.value = tone.toLowerCase();
        option.textContent = tone;
        dropdown.appendChild(option);
    });

    return dropdown;
}

function injectButton(){
    const existingButton = document.querySelector('.ai-reply-button');
    const existingDropdown = document.querySelector('.tone-dropdown');
    
    // Remove the existing button and dropdown if they exist
    if (existingButton) existingButton.remove();
    if (existingDropdown) existingDropdown.remove();

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.error("Compose toolbar not found");
        return;
    }
    console.log("Compose toolbar found, injecting button and dropdown");

    // Create the button and dropdown
    const button = createAIButton();
    button.classList.add('ai-reply-button');

    const toneDropdown = createToneDropdown();

    // Inject both button and dropdown into the toolbar
    toolbar.insertBefore(toneDropdown, toolbar.firstChild); // Insert dropdown before button
    toolbar.insertBefore(button, toneDropdown.nextSibling); // Insert button right after the dropdown

    button.addEventListener('click', async () => {
        try {
            button.innerHTML = 'Drafting...';
            button.disabled = true;

            const emailContent = getEmailContent();
            if (!emailContent) {
                alert("No email content found to draft a reply.");
                return;
            }
            console.log('Fetching email content:', emailContent);

            const selectedTone = toneDropdown.value || 'professional'; // Default to 'professional'

            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    emailContent: emailContent,
                    tone: selectedTone
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const generatedReply = await response.text();
            if (!generatedReply) {
                alert('Generated reply is empty!');
                return;
            }
            console.log('Generated reply:', generatedReply);

            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            } else {
                console.error('Compose box was not found');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to generate reply');
        } finally {
            button.innerHTML = 'Draft AI';
            button.disabled = false;
        }
    });
    //toolbar.insertBefore(button, toolbar.firstChild);
}



const observer = new MutationObserver((mutations) => {
    for(const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE && 
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
        );

        if (hasComposeElements) {
            console.log("Compose Window Detected");
            setTimeout(injectButton, 500);
        }
    }
});

// let buttonInjected = false;
// const observer = new MutationObserver((mutations) => {
//     for(const mutation of mutations) {
//         const addedNodes = Array.from(mutation.addedNodes);
//         const hasComposeElements = addedNodes.some(node =>
//             node.nodeType === Node.ELEMENT_NODE && 
//             (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
//         );

//         if (hasComposeElements && !buttonInjected) {
//             console.log("Compose Window Detected");
//             setTimeout(() => {
//                 injectButton();
//                 buttonInjected = true; 
//             }, 500);
//         }
//     }
// });

observer.observe(document.body, {
    childList: true,
    subtree: true
})