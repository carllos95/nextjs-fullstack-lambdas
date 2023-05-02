import Box from "@src/components/Box/Box";
import Button from "@src/components/Button/Button";
import Image from "@src/components/Image/Image";
import Text from "@src/components/Text/Text";
import { BaseComponent } from "@src/theme/BaseComponent";
import { useState } from "react";

function useForm({ initialValues }) {
  const [values, setValues] = useState(initialValues)
  return {
    values,
    handleChange(event) {
      const { name, value } = event.target
      setValues({
        ...values,
        [name]: value
      })
    }
  }
}

export default function NewsLetterScreen() {
  const form = useForm({
    initialValues: {
      emailNewsletter: ''
    }
  })

  return (
    <Box styleSheet={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <form
        onSubmit={(event) => {
          event.preventDefault()

          if (!form.values.emailNewsletter.includes('@')) {
            alert('Você precisa informa um e-mail válido!')
            return
          }

          alert('Você foi cadastrado com sucesso! Chegue seu e-mail!')

          fetch('/api/newsletter/optin', {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify(form.values)
          }).then(async (response) => {
            console.log(await response.json())
          })
        }}
      >
        <Box styleSheet={{
          alignItems: 'center',
          width: '100%',
          maxWidth: '400px',
          padding: '16px'
        }}>

          <Image
            src="https://avatars.githubusercontent.com/u/62628370?v=4"
            alt="Foto do Dev Carlos Dantas"
            styleSheet={{
              borderRadius: '100%',
              width: '100px',
              marginBottom: '16px'
            }}
          />
          <Text variant="heading4">
            Newsletter DevCarlos
          </Text>

          <NewsletterTextField
            name='emailNewsletter'
            placeholder="Informe seu E-mail"
            value={form.values.emailNewsletter}
            onChange={form.handleChange}
          />

          <Button fullWidth styleSheet={{ marginTop: '16px' }}>
            Cadastrar
          </Button>
        </Box>
      </form>
    </Box>
  )
}

interface NewsletterTextFieldProps {
  name: string
  placeholder?: string
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function NewsletterTextField(props: NewsletterTextFieldProps) {
  return (
    <Box
      styleSheet={{
        width: '100%',
        maxWidth: '300px'
      }}
    >
      <BaseComponent
        as="input"
        {...props}
        styleSheet={{
          border: '1px solid #000',
          borderRadius: '4px',
          padding: '8px',
          width: '100%'
        }}
      />
    </Box>
  )
}
