console.log('进入了Redirect.js')
console.log(JSON.stringify($request))

if($request.url.indexOf('_1/') > -1){
    console.log('重定向'+$request.url.replace('_1/','/'))
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