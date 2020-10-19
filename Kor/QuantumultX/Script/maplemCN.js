var ren  = init();
const isMarketVersions = $request.url.indexOf('MarketVersion') > -1;
const isAssetBundleTable = $request.url.indexOf('AssetBundle_table.xml') > -1;
const isRedirect = $request.url.indexOf('_1/') > -1;
const mode = ren.getdata('maplem-kr-mode');//汉化模式
const isNeedRedirect = 'maplem-kr_redirect';//是否资源重定向
const config = {
    API:'https://raw.githubusercontent.com/MapleRen/MapleStoryM-language/master/xml/mod_pro.xml',
    title:'冒险岛M韩服汉化',
    files :ren.getdata('maplem-kr-files')//汉化模式
}


// const modeConfig = {
//     'BASE':{
//         API:'https://raw.githubusercontent.com/MapleRen/MapleStoryM-language/master/xml/mod.xml',
//         files:['data.bin.lan.kor.tbl', 'data.table.unity3d'],
//         title:'基础汉化'
//     },
//     'PRO':{
//         API:'https://raw.githubusercontent.com/MapleRen/MapleStoryM-language/master/xml/mod_pro.xml',
//         files:['data.bin.lan.kor.tbl', 'data.table.unity3d','data.language_kor.unity3d'],
//         title:'进阶汉化'
//     }
// }

function rewrite() {
    let body = compressXml($response.body);
    const crcReg = /.*<Header CRC=\"(.*?)\"([^\[]*)/gm;
      
    const xmlCRC = body.replace(crcReg,'$1');
    ren.get({url:config.API},(error,response,data)=>{
        if(response){
            if (response.statusCode != 200) {
                notifyAndSetValue(config.title,'XML请求失败，请重试','false',isNeedRedirect);
                ren.done({});
            }
            const latestXml = compressXml(response.body);
            const latestXmlCRC = latestXml.replace(crcReg,'$1');
            if(xmlCRC != latestXmlCRC){
                notifyAndSetValue(config.title,'汉化文件未更新，请关注微博"冒险岛M第三汉化委"获取最新消息','false',isNeedRedirect);
                ren.done({});
            }else{
                const files = config.files?config.files.split(','):[];
                for (let i = 0; i < files.length; i++) {
                    const file = files[i]
                    const fileCRC = latestXml.getXmlAttr(file,"FileCRC");
                    const fileSize = latestXml.getXmlAttr(file,"Size");
                    body = body.setXmlAttr(file,"FileCRC",fileCRC).setXmlAttr(file,"CRC",fileCRC).setXmlAttr(file,"Size",fileSize);
                }
                notifyAndSetValue(config.title,'补丁下载完成即可完成汉化','true',isNeedRedirect);
                ren.done(body);
            }
        }
        if(error){
            notifyAndSetValue(config.title,reason.error,'false',isNeedRedirect);
            ren.done(body);
        }
    })
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

function notifyAndSetValue(title,msg,success,prefix){
    ren.msg(title, "", msg);
    ren.setdata(prefix,success)
}

function redirect() {
    const github_path = 'https://raw.githubusercontent.com/MapleRen/MapleStoryM-language/master/';
    const need_redirect = ren.getdata(isNeedRedirect);
    const file_name = $request.url.slice($request.url.lastIndexOf('@') + 1);
    if (need_redirect == 'true' && config.files.indexOf(file_name)>-1) {
        const mStatus = "HTTP/1.1 302 Temporary Redirect"//"HTTP/1.1 302 Found";
        const mHeaders = { "Location": `${github_path}${file_name}` };
        const mResponse = {
            status: mStatus,
            headers: mHeaders
        }
        ren.done(mResponse);
    }else{
        ren.done({});
    }
}



if(mode == 'CLEAR'){
    console.log('缓存清理')
    if(isRedirect){
        var mStatus = "HTTP/1.1 302 Found";
        var mHeaders = {"Location": $request.url.replace('_1/','/')};
        var mResponse = {
            status:mStatus,
            headers:mHeaders
        }
        ren.done(mResponse);
    }
    else if (isMarketVersions) {
        var body = $response.body;
        var list = body.split('\n');
        var fileList = ['data.bin.lan.kor.tbl', 'data.language_kor.unity3d', 'data.table.unity3d']
        for (let i = 0; i < list.length; i++) {
            if (list[i].indexOf('\/AppStore\/') > -1) {
                list[i] = list[i].replace('/" Server', '_1/" Server')
            }
        }
        var xmlData = list.join('\n')
        ren.done(xmlData)
    } 
    else if(isAssetBundleTable) {
        var body = $response.body;
        var list = body.split('\n');
        var fileList = ['data.bin.lan.kor.tbl', 'data.language_kor.unity3d', 'data.table.unity3d']
        for (let i = 0; i < list.length; i++) {
            var flag = fileList.filter(function (item) { return list[i].indexOf(item) > -1; }).length > 0;
            if (flag) {
                list[i] = list[i].replace(/Version="[0-9.]*?"/i, 'Version="99"')
            }
        }
        var xmlData = list.join('\n')
        ren.done(xmlData)
    }
    else{
        ren.done({});
    }
}
else if (mode == 'RUN'){
    if(isAssetBundleTable){
        rewrite();
    }else if(isMarketVersions){
        ren.done({});
    }else{
        redirect();
    }
}else{
    console.log("韩文原版模式")
    ren.done({});
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