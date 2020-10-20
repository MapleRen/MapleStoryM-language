//  https://github.com/sazs34/TaskConfig
let isQuantumultX=void 0!=$task,isSurge=void 0!=$httpClient;var $task=isQuantumultX?$task:{},$httpClient=isSurge?$httpClient:{},$prefs=isQuantumultX?$prefs:{},$persistentStore=isSurge?$persistentStore:{},$notify=isQuantumultX?$notify:{},$notification=isSurge?$notification:{};if(isQuantumultX){var errorInfo={error:""};$httpClient={get:(t,r)=>{var e;e="string"==typeof t?{url:t}:t,$task.fetch(e).then(t=>{r(void 0,t,t.body)},t=>{errorInfo.error=t.error,r(errorInfo,response,"")})},post:(t,r)=>{var e;e="string"==typeof t?{url:t}:t,t.method="POST",$task.fetch(e).then(t=>{r(void 0,t,t.body)},t=>{errorInfo.error=t.error,r(errorInfo,response,"")})}}}isSurge&&($task={fetch:t=>new Promise((r,e)=>{"POST"==t.method?$httpClient.post(t,(t,e,o)=>{e?(e.body=o,r(e,{error:t})):r(null,{error:t})}):$httpClient.get(t,(t,e,o)=>{e?(e.body=o,r(e,{error:t})):r(null,{error:t})})})}),isQuantumultX&&($persistentStore={read:t=>$prefs.valueForKey(t),write:(t,r)=>$prefs.setValueForKey(t,r)}),isSurge&&($prefs={valueForKey:t=>$persistentStore.read(t),setValueForKey:(t,r)=>$persistentStore.write(t,r)}),isQuantumultX&&($notification={post:(t,r,e)=>{$notify(t,r,e)}}),isSurge&&($notify=function(t,r,e){$notification.post(t,r,e)});

var body = $response.body;
var list = body.split('\n');
var fileList = ['data.bin.lan.kor.tbl', 'data.language_kor.unity3d', 'data.table.unity3d']
var isMarketVersions = $request.url.indexOf('MarketVersion') > -1;

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
$done(xmlData)