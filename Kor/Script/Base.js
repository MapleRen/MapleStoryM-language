//  https://github.com/sazs34/TaskConfig
let isQuantumultX=undefined===this.$task?false:true;let isSurge=undefined===this.$httpClient?false:true;var $task=isQuantumultX?this.$task:{};var $httpClient=isSurge?this.$httpClient:{};var $prefs=isQuantumultX?this.$prefs:{};var $persistentStore=isSurge?this.$persistentStore:{};var $notify=isQuantumultX?this.$notify:{};var $notification=isSurge?this.$notification:{};if(isQuantumultX){var errorInfo={error:''};$httpClient={get:(url,cb)=>{var urlObj;if(typeof(url)=='string'){urlObj={url:url}}else{urlObj=url}$task.fetch(urlObj).then(response=>{cb(undefined,response,response.body)},reason=>{errorInfo.error=reason.error;cb(errorInfo,response,'')})},post:(url,cb)=>{var urlObj;if(typeof(url)=='string'){urlObj={url:url}}else{urlObj=url}url.method='POST';$task.fetch(urlObj).then(response=>{cb(undefined,response,response.body)},reason=>{errorInfo.error=reason.error;cb(errorInfo,response,'')})}}}if(isSurge){$task={fetch:url=>{return new Promise((resolve,reject)=>{if(url.method=='POST'){$httpClient.post(url,(error,response,data)=>{if(response){response.body=data;resolve(response,{error:error})}else{resolve(null,{error:error})}})}else{$httpClient.get(url,(error,response,data)=>{if(response){response.body=data;resolve(response,{error:error})}else{resolve(null,{error:error})}})}})}}}if(isQuantumultX){$persistentStore={read:key=>{return $prefs.valueForKey(key)},write:(val,key)=>{return $prefs.setValueForKey(val,key)}}}if(isSurge){$prefs={valueForKey:key=>{return $persistentStore.read(key)},setValueForKey:(val,key)=>{return $persistentStore.write(val,key)}}}if(isQuantumultX){$notification={post:(title,subTitle,detail)=>{$notify(title,subTitle,detail)}}}if(isSurge){$notify=function(title,subTitle,detail){$notification.post(title,subTitle,detail)}}
//用于获取仓库里data.bin.lan.kor.tbl的size，与最新xml里的Size做比较
const config ={
  API:'https://raw.githubusercontent.com/MapleRen/MapleStoryM-language/master/xml/mod.xml',
  files:['data.bin.lan.kor.tbl', 'data.table.unity3d'],
  prefix:'msm_kor_needRedirect',
  title:'基础汉化'
}

async function rewrite() {
  let body = compressXml($response.body);
  const crcReg = /.*<Header CRC=\"(.*?)\"([^\[]*)/gm;
  notifyAndSetValue('正在获取最新汉化信息...','false');
  const xmlCRC = body.replace(crcReg,'$1');
  $task.fetch({url:config.API}).then(response => {

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
          $done({body:body});
      }
  }, reason => {
      notifyAndSetValue(reason.error,'false');
      $done({body:body})
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
      const mStatus = isQuantumultX?"HTTP/1.1 302 Found":302;
      const mHeaders = { "Location": `${github_path}${file_name}` };
      const mResponse = {
          status: mStatus,
          headers: mHeaders
      }
      $done(mResponse);
  }
}
(async function(){
	if($request.url.indexOf('AssetBundle_table.xml') != -1){
	  await rewrite();
	}else{
	  redirect();
	}
})()