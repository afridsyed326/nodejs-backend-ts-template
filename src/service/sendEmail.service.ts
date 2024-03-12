// MODULE IMPORTS
import nodemailer, { Transporter } from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import handlebars from 'handlebars';

// INTERFACE
interface EmailOptions {
  from: string;
  to: any;
  subject?: string;
  template?: string;
  context?: any;
}



handlebars.registerHelper('eq', function(this: Handlebars.HelperDelegate, a: any, b: any, options: Handlebars.HelperOptions) {
  return a === b;
});


class EmailSender {
  private transporter: Transporter;
  private defaultOptions: EmailOptions;

  constructor(
    private email?: string | string[],
    private subject?: string,
    private templateName?: string,
    private context?: any
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Configure Handlebars setup
    const handlebarsOptions = {
      viewEngine: {
        extName: '.handlebars',
        partialsDir: path.resolve('./src/email_templates/partials'),
        defaultLayout: false,
      },
      viewPath: path.resolve('./src/email_templates/views'),
      extName: '.hbs',
    };

    this.transporter.use('compile', hbs(handlebarsOptions as hbs.NodemailerExpressHandlebarsOptions));

    this.defaultOptions = {
      from: 'Compaby name',
      to: this.email,
      subject: this?.subject,
      template: this?.templateName,
      context: this.context || {},
    };

    this.send();
  }

  public async send(): Promise<void> {
    try {
      const info = await this.transporter.sendMail(this.defaultOptions);
      console.log('\nEmail sent:', info.response);
      console.log('\n --------------------- \n');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}

export default EmailSender;
