//用于获取仓库里data.bin.lan.kor.tbl的size，与最新xml里的Size做比较
const config ={
    API:'https://raw.githubusercontent.com/MapleRen/MapleStoryM-language/master/xml/mod.xml',
    files:['data.bin.lan.kor.tbl', 'data.table.unity3d'],
    prefix:'msm_kor_needRedirect',
    title:'基础汉化'
}
var ren  = init();


function rewrite() {
    let body = compressXml($response.body);
    const crcReg = /.*<Header CRC=\"(.*?)\"([^\[]*)/gm;
    notifyAndSetValue('正在获取最新汉化信息...','false');
    const xmlCRC = body.replace(crcReg,'$1');
    ren.get(config.API,(error,response,data)=>{
        if(response){
            if (response.statusCode != 200) {
                notifyAndSetValue('XML请求失败，请重试','false');
                ren.done({});
            }
            const latestXml = compressXml(response.body);
            const latestXmlCRC = latestXml.replace(crcReg,'$1');
            if(xmlCRC != latestXmlCRC){
                notifyAndSetValue('汉化文件未更新，请关注微博"冒险岛M第三汉化委"获取最新消息','false');
                ren.done({});
            }else{
                for (let i = 0; i < config.files.length; i++) {
                    const file = config.files[i]
                    const fileCRC = latestXml.getXmlAttr(file,"FileCRC");
                    const fileSize = latestXml.getXmlAttr(file,"Size");
                    body = body.setXmlAttr(file,"FileCRC",fileCRC).setXmlAttr(file,"CRC",fileCRC).setXmlAttr(file,"Size",fileSize);
                }
                notifyAndSetValue('补丁下载完成即可完成汉化','true');
                //console.log(body);
                ren.done(body);
            }
        }
        if(error){
            notifyAndSetValue(error,'false');
            ren.done(body);
        }
        
    });
}

String.prototype.getXmlAttr =function(path,attr){
    const reg = new RegExp(`^(.*Path=\"${path}\"[^\>]*${attr}=\")(\\d+)(\".*)`)
    return this.replace(reg,'$2')
}
String.prototype.setXmlAttr =function(path,attr,value){
    const reg = new RegExp(`^(.*Path=\"${path}\"[^\>]*${attr}=\")\\d+(\".*)`)
    return this.replace(reg,`$1${value}$2`)
}

function compressXml(xml){
    const rep = /\n+/g;
    const repone = /<!--.*?-->/ig;
    const reptwo = /\/\*.*?\*\//ig;
    const reptree = /[ ]+</ig;
    let sourceZero = xml.replace(rep,"").replace(/[\r\n]/g,"");
    let sourceOne = sourceZero.replace(repone,"");
    let sourceTwo = sourceOne.replace(reptwo,"");
    let sourceTree = sourceTwo.replace(reptree,"<");
    return sourceTree;
}

function notifyAndSetValue(msg,success){
    ren.msg(config.title, "", msg);
    ren.setdata(config.prefix, success)
}

function redirect() {
    const github_path = 'https://raw.githubusercontent.com/MapleRen/MapleStoryM-language/master/';
    const need_redirect = ren.getdata(config.prefix);
    const file_name = $request.url.slice($request.url.lastIndexOf('@') + 1);
    if (need_redirect == 'true') {
        const mStatus = "HTTP/1.1 302 Found";
        const mHeaders = { "Location": `${github_path}${file_name}` };
        const mResponse = {
            status: mStatus,
            headers: mHeaders
        }
        ren.done(mResponse);
    }
}

if($request.url.indexOf('AssetBundle_table.xml') != -1){
    rewrite();
}else{
    redirect();
}

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