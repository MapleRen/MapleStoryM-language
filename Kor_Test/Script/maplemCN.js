//  https://github.com/sazs34/TaskConfig
let isQuantumultX=undefined===this.$task?false:true;let isSurge=undefined===this.$httpClient?false:true;var $task=isQuantumultX?this.$task:{};var $httpClient=isSurge?this.$httpClient:{};var $prefs=isQuantumultX?this.$prefs:{};var $persistentStore=isSurge?this.$persistentStore:{};var $notify=isQuantumultX?this.$notify:{};var $notification=isSurge?this.$notification:{};if(isQuantumultX){var errorInfo={error:''};$httpClient={get:(url,cb)=>{var urlObj;if(typeof(url)=='string'){urlObj={url:url}}else{urlObj=url}$task.fetch(urlObj).then(response=>{cb(undefined,response,response.body)},reason=>{errorInfo.error=reason.error;cb(errorInfo,response,'')})},post:(url,cb)=>{var urlObj;if(typeof(url)=='string'){urlObj={url:url}}else{urlObj=url}url.method='POST';$task.fetch(urlObj).then(response=>{cb(undefined,response,response.body)},reason=>{errorInfo.error=reason.error;cb(errorInfo,response,'')})}}}if(isSurge){$task={fetch:url=>{return new Promise((resolve,reject)=>{if(url.method=='POST'){$httpClient.post(url,(error,response,data)=>{if(response){response.body=data;resolve(response,{error:error})}else{resolve(null,{error:error})}})}else{$httpClient.get(url,(error,response,data)=>{if(response){response.body=data;resolve(response,{error:error})}else{resolve(null,{error:error})}})}})}}}if(isQuantumultX){$persistentStore={read:key=>{return $prefs.valueForKey(key)},write:(val,key)=>{return $prefs.setValueForKey(val,key)}}}if(isSurge){$prefs={valueForKey:key=>{return $persistentStore.read(key)},setValueForKey:(val,key)=>{return $persistentStore.write(val,key)}}}if(isQuantumultX){$notification={post:(title,subTitle,detail)=>{$notify(title,subTitle,detail)}}}if(isSurge){$notify=function(title,subTitle,detail){$notification.post(title,subTitle,detail)}}
const isMarketVersions = $request.url.indexOf('MarketVersion') > -1;
const isAssetBundleTable = $request.url.indexOf('AssetBundle_table.xml') > -1;
const isRedirect = $request.url.indexOf('_1/') > -1;
const mode = $prefs.valueForKey('maplem-kr-mode');//汉化模式
const isNeedRedirect = 'maplem-kr_redirect';//是否资源重定向
const config = {
    API:'https://raw.githubusercontent.com/MapleRen/MapleStoryM-language/master/xml/mod_pro.xml',
    title:'冒险岛M韩服汉化',
    files :$prefs.valueForKey('maplem-kr-files')//汉化模式
}
async function rewrite() {
    let body = compressXml($response.body);
    const crcReg = /.*<Header CRC=\"(.*?)\"([^\[]*)/gm;
      
    const xmlCRC = body.replace(crcReg,'$1');
    $task.fetch({url:config.API}).then(response => {
        if (response.statusCode != 200) {
            notifyAndSetValue(config.title,'XML请求失败，请重试','false',isNeedRedirect);
            $done({});
        }
        const latestXml = compressXml(response.body);
        const latestXmlCRC = latestXml.replace(crcReg,'$1');
        if(xmlCRC != latestXmlCRC){
            notifyAndSetValue(config.title,'汉化文件未更新，请关注微博"冒险岛M第三汉化委"获取最新消息','false',isNeedRedirect);
            $done({});
        }else{
            const files = config.files?config.files.split(','):[];
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                const fileCRC = latestXml.getXmlAttr(file,"FileCRC");
                const fileSize = latestXml.getXmlAttr(file,"Size");
                body = body.setXmlAttr(file,"FileCRC",fileCRC).setXmlAttr(file,"CRC",fileCRC).setXmlAttr(file,"Size",fileSize);
            }
            notifyAndSetValue(config.title,'补丁下载完成即可完成汉化','true',isNeedRedirect);
            $done({body:body});
        }
    }, reason => {
        notifyAndSetValue(config.title,reason.error,'false',isNeedRedirect);
        $done({});
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

function notifyAndSetValue(title,msg,success,prefix){
    $notify(title, "", msg);
    $prefs.setValueForKey(success, prefix)
}

function redirect() {
    const github_path = 'https://raw.githubusercontent.com/MapleRen/MapleStoryM-language/master/';
    const need_redirect = $prefs.valueForKey(isNeedRedirect);
    const file_name = $request.url.slice($request.url.lastIndexOf('@') + 1);
    if (need_redirect == 'true' && config.files.indexOf(file_name)>-1) {
        const mStatus = isQuantumultX?"HTTP/1.1 302 Found":302;
        const mHeaders = { "Location": `${github_path}${file_name}` };
        const mResponse = {
            status: mStatus,
            headers: mHeaders
        }
        $done(mResponse);
    }else{
        $done({});
    }
}


(async function(){
    if(mode == 'CLEAR'){
        console.log('缓存清理')
        if(isRedirect){
            var mStatus = isQuantumultX?"HTTP/1.1 302 Found":302;
            var mHeaders = {"Location": $request.url.replace('_1/','/')};
            var mResponse = {
                status:mStatus,
                headers:mHeaders
            }
            
            $done(mResponse);
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
            $notify("冒险岛M", "", "文件重置完成，弹出更新框或读条完毕后关闭游戏，切换模式后重新进入游戏即可完成汉化");
            var xmlData = list.join('\n')
            $done({body:xmlData})
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
            $done({body:xmlData})
        }
        else{
            $done({});
        }
    }
    else if (mode == 'RUN'){
        if(isAssetBundleTable){
            await rewrite();
        }else if(isMarketVersions){
            $done({});
        }else{
            redirect();
        }
    }else{
        //console.log("韩文原版模式")
        $done({});
    }
    
})()
