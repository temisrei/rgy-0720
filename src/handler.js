const {LineHandler} = require('bottender')
const olami = require('./nlp/Olami')

exports.lineHandler = new LineHandler()
    .onText(async context => {
            const text = context.event.text
            // const reply = text
            const reply = await olami.nli(text)
            await context.replyText(reply)
        }
    )