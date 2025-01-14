import { useState } from 'react'
import './App.css'
import { Box, Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import axios from 'axios'

function App() {
  const [emailContent, setEmailContent] = useState('')
  const [tone, setTone] = useState('')
  const [generatedReply, setGeneratedReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      // const response = await axios.post("http://localhost:8080/api/email/generate", { emailContent, tone })
      const response = await axios.post("https://emailresponser-latest.onrender.com/api/email/generate", { emailContent, tone })
      
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data))
    } catch (error) {
      setError('Failed to generate email reply. Please try again ' + error.message)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{
          mb: 2,
          color: 'primary.main', // Primary theme color
          fontWeight: 'bold', // Bold text
          textTransform: 'uppercase', // Transform to uppercase
          letterSpacing: 1, // Add letter spacing
          background: 'linear-gradient(to right,rgb(136, 71, 206),rgb(34, 105, 228))', // Gradient background
          WebkitBackgroundClip: 'text', // Clip background to text
          WebkitTextFillColor: 'transparent', // Make background visible through text
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, // Responsive font size
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)', // Subtle text shadow
        }}
      >
        Email Response Wizard
      </Typography>

      <Box sx={{ mx: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          label='Original Email Content'
          value={emailContent || ''}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth variant='outlined' sx={{ mb: 2 }}>
          <InputLabel>Tone (Optional)</InputLabel>

          <Select
            value={tone || ''}
            label={"Tone (Optional)"}
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="formal">Formal</MenuItem>
            <MenuItem value="informal">Informal</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
            <MenuItem value="Swaggy">Swaggy</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="urgent">Urgent</MenuItem>
            <MenuItem value="apologetic">Apologetic</MenuItem>
            <MenuItem value="appreciative">Appreciative</MenuItem>
            <MenuItem value="sympathetic">Sympathetic</MenuItem>
            <MenuItem value="confident">Confident</MenuItem>
            <MenuItem value="confused">Confused</MenuItem>
            <MenuItem value="excited">Excited</MenuItem>
          </Select>

          <Button variant='contained' sx={{ mt: 2 }} onClick={handleSubmit} disabled={!emailContent || loading} fullWidth>
            {loading ? <CircularProgress size={24} /> : "Generate Reply"}
          </Button>
        </FormControl>
      </Box>

      {error && (
        <Typography variant='body1' color='error' align='center' sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {generatedReply && (
        <Box sx={{ mx: 3, mt: 2 }}>
          <Typography variant='h6' component='h2' gutterBottom align='center'>
            Generated Reply
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={6}
            variant='outlined'
            label='Generated Reply'
            value={generatedReply || ''}
            sx={{ mb: 2 }}
          />

          <Button variant='outlined' sx={{ mt: 2, ml: 'auto', display: 'block' }} onClick={() => navigator.clipboard.writeText(generatedReply)}>
            Copy to Clipboard
          </Button>
        </Box>
      )}
    </Container>
  )
}

export default App
