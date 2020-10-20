//  https://github.com/sazs34/TaskConfig
let isQuantumultX=void 0!=$task,isSurge=void 0!=$httpClient;var $task=isQuantumultX?$task:{},$httpClient=isSurge?$httpClient:{},$prefs=isQuantumultX?$prefs:{},$persistentStore=isSurge?$persistentStore:{},$notify=isQuantumultX?$notify:{},$notification=isSurge?$notification:{};if(isQuantumultX){var errorInfo={error:""};$httpClient={get:(t,r)=>{var e;e="string"==typeof t?{url:t}:t,$task.fetch(e).then(t=>{r(void 0,t,t.body)},t=>{errorInfo.error=t.error,r(errorInfo,response,"")})},post:(t,r)=>{var e;e="string"==typeof t?{url:t}:t,t.method="POST",$task.fetch(e).then(t=>{r(void 0,t,t.body)},t=>{errorInfo.error=t.error,r(errorInfo,response,"")})}}}isSurge&&($task={fetch:t=>new Promise((r,e)=>{"POST"==t.method?$httpClient.post(t,(t,e,o)=>{e?(e.body=o,r(e,{error:t})):r(null,{error:t})}):$httpClient.get(t,(t,e,o)=>{e?(e.body=o,r(e,{error:t})):r(null,{error:t})})})}),isQuantumultX&&($persistentStore={read:t=>$prefs.valueForKey(t),write:(t,r)=>$prefs.setValueForKey(t,r)}),isSurge&&($prefs={valueForKey:t=>$persistentStore.read(t),setValueForKey:(t,r)=>$persistentStore.write(t,r)}),isQuantumultX&&($notification={post:(t,r,e)=>{$notify(t,r,e)}}),isSurge&&($notify=function(t,r,e){$notification.post(t,r,e)});

if($request.url.indexOf('_1/') > -1){
  var mStatus = "HTTP/1.1 302 Found";
  var mHeaders = {"Location": $request.url.replace('_1/','/')};
  var mResponse = {
      status:mStatus,
      headers:mHeaders
  }
  $done(mResponse);
}else{
  $done({});
}