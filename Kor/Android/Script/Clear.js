//  https://github.com/sazs34/TaskConfig
let isQuantumultX=undefined===this.$task?false:true;let isSurge=undefined===this.$httpClient?false:true;var $task=isQuantumultX?this.$task:{};var $httpClient=isSurge?this.$httpClient:{};var $prefs=isQuantumultX?this.$prefs:{};var $persistentStore=isSurge?this.$persistentStore:{};var $notify=isQuantumultX?this.$notify:{};var $notification=isSurge?this.$notification:{};if(isQuantumultX){var errorInfo={error:''};$httpClient={get:(url,cb)=>{var urlObj;if(typeof(url)=='string'){urlObj={url:url}}else{urlObj=url}$task.fetch(urlObj).then(response=>{cb(undefined,response,response.body)},reason=>{errorInfo.error=reason.error;cb(errorInfo,response,'')})},post:(url,cb)=>{var urlObj;if(typeof(url)=='string'){urlObj={url:url}}else{urlObj=url}url.method='POST';$task.fetch(urlObj).then(response=>{cb(undefined,response,response.body)},reason=>{errorInfo.error=reason.error;cb(errorInfo,response,'')})}}}if(isSurge){$task={fetch:url=>{return new Promise((resolve,reject)=>{if(url.method=='POST'){$httpClient.post(url,(error,response,data)=>{if(response){response.body=data;resolve(response,{error:error})}else{resolve(null,{error:error})}})}else{$httpClient.get(url,(error,response,data)=>{if(response){response.body=data;resolve(response,{error:error})}else{resolve(null,{error:error})}})}})}}}if(isQuantumultX){$persistentStore={read:key=>{return $prefs.valueForKey(key)},write:(val,key)=>{return $prefs.setValueForKey(val,key)}}}if(isSurge){$prefs={valueForKey:key=>{return $persistentStore.read(key)},setValueForKey:(val,key)=>{return $persistentStore.write(val,key)}}}if(isQuantumultX){$notification={post:(title,subTitle,detail)=>{$notify(title,subTitle,detail)}}}if(isSurge){$notify=function(title,subTitle,detail){$notification.post(title,subTitle,detail)}}
var isMarketVersions = $request.url.indexOf('MarketVersion') > -1;
var isAssetBundleTable = $request.url.indexOf('AssetBundle_table.xml') > -1;
var isRedirect = $request.url.indexOf('_1/') > -1;
if (isMarketVersions) {
    //资源版本缓存强制清理
    var body = $response.body;
    var list = body.split('\n');
    for (let i = 0; i < list.length; i++) {
        if (list[i].indexOf('\/AppStore\/') > -1) {
            list[i] = list[i].replace('/" Server', '_1/" Server')
        }
    }
    $notify("冒险岛M", "", "文件重置完成，弹出更新框或读条完毕后关闭游戏，切换模式后重新进入游戏即可完成汉化");
    var xmlData = list.join('\n')
    $done({body:xmlData})
} else if (isRedirect) {
    //资源版本重定向
    var mStatus = isQuantumultX?"HTTP/1.1 302 Found":302;
    var mHeaders = { "Location": $request.url.replace('_1/', '/') };
    var mResponse = {
        status: mStatus,
        headers: mHeaders
    }
    
    $done(mResponse);
} else if (isAssetBundleTable) {
    //修改官方文件Version，强制清空已下载的文件
    var fileList = ['data.bin.lan.kor.tbl', 'data.language_kor.unity3d', 'data.table.unity3d']
    var body = $response.body;
    var list = body.split('\n');
    for (let i = 0; i < list.length; i++) {
        var flag = fileList.filter(function (item) { return list[i].indexOf(item) > -1; }).length > 0;
        if (flag) {
            list[i] = list[i].replace(/Version="[0-9.]*?"/i, 'Version="99"')
        }
    }
    //$notify("冒险岛M", "", "文件重置完成，弹出更新框后(也可下载完毕后)关闭游戏，切换模式后重新进入游戏即可完成汉化");
    var xmlData = list.join('\n')
    $done({body:xmlData})
} else {
    $done({});
}