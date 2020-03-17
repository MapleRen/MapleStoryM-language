const github_path = 'https://raw.githubusercontent.com/MapleRen/MapleStoryM-language/master/';
const need_redirect = $prefs.valueForKey('msm_kor_needRedirect');
const file_name = $request.url.slice($request.url.lastIndexOf('@') + 1);
if (need_redirect == 'true') {
    var mStatus = "HTTP/1.1 302 Found";
    var mHeaders = { "Location": `${github_path}${file_name}` };
    var mResponse = {
        status: mStatus,
        headers: mHeaders
    }
    $done(mResponse);
}