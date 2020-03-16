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