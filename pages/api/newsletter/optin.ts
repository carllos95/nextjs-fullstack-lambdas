import { NextApiRequest, NextApiResponse } from "next";
import sendGridMail from '@sendgrid/mail'
import { createClient } from '@supabase/supabase-js'

// supabase setup
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY

const dbClient = createClient(SUPABASE_URL, SUPABASE_KEY)

const httpStatus = {
  Success: 200,
  BadRequest: 400,
  InternalServerError: 500,
  notFound: 404
}

const controllerByMethod = {
  async POST(req: NextApiRequest, res: NextApiResponse) {
    const email = req.body.emailNewsletter

    // Fail fast Validation
    if (!Boolean(email) || !email.includes('@')) {
      res.status(httpStatus.BadRequest).json({ message: 'Você precisa enviar um email valido ex: teste@teste.com' })
      return
    }

    // Sanitize do email
    // - Remocer potenciais códigos maliciosos
    // - Remover X coisas

    // cria user newsletter
    await dbClient.from('newsletters_users').insert({ email: email, optin: true })

    // criar user do sistema
    // await dbClient.auth.admin.createUser({ email: email })

    try {
      sendGridMail.setApiKey(process.env.SENDGRID_KEY)
      await sendGridMail.send({
        to: `${email}`,
        from: 'carlos95rodrigo@hotmail.com',
        subject: 'Titulo do Email',
        html: 'Aqui vai o <strong>Conteúdo!!!</strong>'
      })

      res.status(httpStatus.Success).json({ message: 'Post request!' })
    } catch (err) {
      res.status(httpStatus.InternalServerError).json({ message: 'Falhamos em enviar o seu Email!' })
      console.log(err)
    }
  },
  async GET(req: NextApiRequest, res: NextApiResponse) {
    const { data, error } = await dbClient.from('newsletters_users').select('*')

    res.status(httpStatus.Success).json({ message: 'GET request', total: data.length })
  }
}

export default function handler(request: NextApiRequest, response: NextApiResponse
) {
  const controller = controllerByMethod[request.method]
  if (!controller) {
    response.status(httpStatus.notFound).json({ message: 'Nada encontrado aqui!' })
    return
  }
  controller(request, response)
}
