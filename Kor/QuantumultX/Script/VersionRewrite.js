var body = $response.body;
var list = body.split('\n');
var fileList = ['data.bin.lan.kor.tbl', 'data.language_kor.unity3d', 'data.table.unity3d']
var isMarketVersions = $request.url.indexOf('MarketVersion') > -1;

var ren  = init();


if (isMarketVersions) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].indexOf('\/AppStore\/') > -1) {
            list[i] = list[i].replace('/" Server', '_1/" Server')
        }
    }
} else {
    for (let i = 0; i < list.length; i++) {
        var flag = fileList.filter(function (item) { return list[i].indexOf(item) > -1; }).length > 0;
        if (flag) {
            list[i] = list[i].replace(/Version="[0-9.]*?"/i, 'Version="99"')
        }
    }
}

var xmlData = list.join('\n')
console.log(xmlData);
ren.done(xmlData)


function init() {
    isSurge = () => {
      return undefined === this.$httpClient ? false : true
    }
    isQuanX = () => {
      return undefined === this.$task ? false : true
    }
    getdata = (key) => {
      if (isSurge()) return $persistentStore.read(key)
      if (isQuanX()) return $prefs.valueForKey(key)
    }
    setdata = (key, val) => {
      if (isSurge()) return $persistentStore.write(key, val)
      if (isQuanX()) return $prefs.setValueForKey(val, key)
    }
    msg = (title, subtitle, body) => {
      if (isSurge()) $notification.post(title, subtitle, body)
      if (isQuanX()) $notify(title, subtitle, body)
    }
    log = (message) => console.log(message)
    get = (url, cb) => {
      if (isSurge()) {
        $httpClient.get(url, cb)
      }
      if (isQuanX()) {
        url.method = 'GET'
        $task.fetch(url).then((resp) => cb(null, {}, resp.body), reason => cb(reason.error, null, null))
      }
    }
    post = (options, callback) => {
      if (isQuanX()) {
        if (typeof options == "string") options = { url: options }
        options["method"] = "POST"
        $task.fetch(options).then(response => {
          response["status"] = response.statusCode
          callback(null, response, response.body)
        }, reason => callback(reason.error, null, null))
      }
      if (isSurge()) $httpClient.post(options, callback)
    }
    done = (value = {}) => {
      $done(value)
    }
    return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
  }