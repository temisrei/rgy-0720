const config = require('../../config')
const axios = require('axios')
const md5 = require('md5')

class Olami {
  constructor(appKey = config.olami.appKey, appSecret = config.olami.appSectet, inputType = 1) {
    this.URL = 'https://tw.olami.ai/cloudservice/api'
    this.appKey = appKey
    this.appSecret = appSecret
    this.inputType = inputType
  }

  nli(text, cusid = null) {
    const timestamp = Date.now()
    return axios.post(this.URL, {}, {
      params: {
        appkey: this.appKey,
        api: 'nli',
        timestamp: timestamp,
        sign: md5(`${this.appSecret}api=nliappkey=${this.appKey}timestamp=${timestamp}${this.appSecret}`),
        cusid: cusid,
        rq: JSON.stringify({
          'data_type': 'stt',
          'data': {
            'input_type': this.inputType,
            'text': text
          }
        })
      }
    }).then(response => {
      const nli = response.data.data.nli[0];
      return this._intentDetection(nli)
    })
  }

  _intentDetection(nli) {
    const type = nli.type
    const desc = nli.desc_obj
    const data = nli.data_obj

    function handleSelectionType(desc) {
      const descType = desc.type

      switch (descType) {
        case 'news':
          return desc.result + '\n\n' + data.map((el, index) => index + 1 + '. ' + el.title).join('\n')
        case 'poem':
          return // TODO
        case 'cooking':
          return // TODO
        default:
          return '對不起，你說的我還不懂，能換個說法嗎？'
      }
    }

    switch (type) {
      case 'kkbox':
        return (data.length > 0) ? data[0].url : desc.result
      case 'ds':
        return desc.result + '\n請用 /help 指令看看我能怎麼幫助您'
      case 'selection':
        return handleSelectionType(desc)
      case 'news':
        return data[0].detail
      case 'baike':
        return data[0].description
      case 'joke':
        return // TODO
      case 'cooking':
        return // TODO
      default:
        return desc.result
    }
  }
}

module.exports = new Olami()