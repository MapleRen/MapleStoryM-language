//  https://github.com/sazs34/TaskConfig
let isQuantumultX=void 0!=$task,isSurge=void 0!=$httpClient;var $task=isQuantumultX?$task:{},$httpClient=isSurge?$httpClient:{},$prefs=isQuantumultX?$prefs:{},$persistentStore=isSurge?$persistentStore:{},$notify=isQuantumultX?$notify:{},$notification=isSurge?$notification:{};if(isQuantumultX){var errorInfo={error:""};$httpClient={get:(t,r)=>{var e;e="string"==typeof t?{url:t}:t,$task.fetch(e).then(t=>{r(void 0,t,t.body)},t=>{errorInfo.error=t.error,r(errorInfo,response,"")})},post:(t,r)=>{var e;e="string"==typeof t?{url:t}:t,t.method="POST",$task.fetch(e).then(t=>{r(void 0,t,t.body)},t=>{errorInfo.error=t.error,r(errorInfo,response,"")})}}}isSurge&&($task={fetch:t=>new Promise((r,e)=>{"POST"==t.method?$httpClient.post(t,(t,e,o)=>{e?(e.body=o,r(e,{error:t})):r(null,{error:t})}):$httpClient.get(t,(t,e,o)=>{e?(e.body=o,r(e,{error:t})):r(null,{error:t})})})}),isQuantumultX&&($persistentStore={read:t=>$prefs.valueForKey(t),write:(t,r)=>$prefs.setValueForKey(t,r)}),isSurge&&($prefs={valueForKey:t=>$persistentStore.read(t),setValueForKey:(t,r)=>$persistentStore.write(t,r)}),isQuantumultX&&($notification={post:(t,r,e)=>{$notify(t,r,e)}}),isSurge&&($notify=function(t,r,e){$notification.post(t,r,e)});

//用于获取仓库里data.bin.lan.kor.tbl的size，与最新xml里的Size做比较
const config ={
  API:'https://raw.githubusercontent.com/MapleRen/MapleStoryM-language/master/xml/mod_pro.xml',
  files:['data.bin.lan.kor.tbl', 'data.table.unity3d','data.language_kor.unity3d'],
  prefix:'msm_kor_needRedirect',
  title:'进阶汉化'
}

function rewrite() {
  let body = compressXml($response.body);
  const crcReg = /.*<Header CRC=\"(.*?)\"([^\[]*)/gm;
  notifyAndSetValue('正在获取最新汉化信息...','false');
  const xmlCRC = body.replace(crcReg,'$1');$task.fetch({url:config.API}).then(response => {

      if (response.statusCode != 200) {
          notifyAndSetValue('XML请求失败，请重试','false');
          $done({});
      }
      const latestXml = compressXml(response.body);
      const latestXmlCRC = latestXml.replace(crcReg,'$1');
      if(xmlCRC != latestXmlCRC){
          notifyAndSetValue('汉化文件未更新，请关注微博"冒险岛M第三汉化委"获取最新消息','false');
          $done({});
      }else{
          for (let i = 0; i < config.files.length; i++) {
              const file = config.files[i]
              const fileCRC = latestXml.getXmlAttr(file,"FileCRC");
              const fileSize = latestXml.getXmlAttr(file,"Size");
              body = body.setXmlAttr(file,"FileCRC",fileCRC).setXmlAttr(file,"CRC",fileCRC).setXmlAttr(file,"Size",fileSize);
          }
          notifyAndSetValue('补丁下载完成即可完成汉化','true');
          //console.log(body);
          $done(body);
      }
  }, reason => {
      notifyAndSetValue(reason.error,'false');
      $done(body);
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
  $notify(config.title, "", msg);
  $prefs.setValueForKey(success, config.prefix)
}

function redirect() {
  const github_path = 'https://raw.githubusercontent.com/MapleRen/MapleStoryM-language/master/';
  const need_redirect = $prefs.valueForKey(config.prefix);
  const file_name = $request.url.slice($request.url.lastIndexOf('@') + 1);
  if (need_redirect == 'true') {
      const mStatus = "HTTP/1.1 302 Found";
      const mHeaders = { "Location": `${github_path}${file_name}` };
      const mResponse = {
          status: mStatus,
          headers: mHeaders
      }
      $done(mResponse);
  }
}

if($request.url.indexOf('AssetBundle_table.xml') != -1){
  rewrite();
}else{
  redirect();
}