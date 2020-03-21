//用于获取仓库里data.bin.lan.kor.tbl的size，与最新xml里的Size做比较
const config ={
    API:'https://raw.githubusercontent.com/MapleRen/MapleStoryM-language/master/xml/mod.xml',
    files:['data.bin.lan.kor.tbl', 'data.table.unity3d'],
    prefix:'msm_kor_needRedirect',
    title:'基础汉化'
}

function rewrite() {
    const body = $response.body;
    let list = body.split('\n');
    const regionReg = /.*Region=\"(.*?)\".*/gm;
    const crcReg = /.*<Header CRC=\"(.*?)\".*/gm;
    const region = body.replace(regionReg,'$1');
    const xmlCRC = body.replace(crcReg,'$1');   
    $task.fetch({url:config.API}).then(response => {
        if (response.statusCode != 200 || region != 'Korea') {
            notifyAndSetValue('XML请求失败，请重试','false');
            $done({});
        }
        const latestXml = response.body;
        const latestXmlCRC = latestXml.replace(crcReg,'$1');
        if(xmlCRC != latestXml){
            notifyAndSetValue('汉化文件未更新，请关注微博"冒险岛M第三汉化委"获取最新消息','false');
            $done({});
        }else{
            for (let i = 0; i < files.length; i++) {
                const fileCRC = latestXml.getXmlAttr(files[i],"FileCRC");
                const fileSize = latestXml.getXmlAttr(files[i],"Size");
                body = body.setXmlAttr(body,files[i],"FileCRC",fileCRC).setXmlAttr(body,files[i],"CRC",fileCRC).setXmlAttr(body,files[i],"Size",fileSize);
            }
            notifyAndSetValue('补丁下载完成即可完成汉化','true');
            console.log(body);
            $done(body);
        }

        let tbl_size = data.find(x => x.name == 'data.bin.lan.kor.tbl').size;
        if (body.indexOf(tbl_size) > -1) {
            for (let i = 0; i < list.length; i++) {
                const file = config.files.filter(item => list[i].indexOf(item) > -1);
                if (file.length > 0) {
                    let item = data.find(x => x.name == file[0]);
                    list[i] = list[i].replace(/Size="[0-9.]*?"/i, 'Size="' + item.size + '"').replace(/FileCRC="[0-9.]*?"/i, 'FileCRC="0"').replace(/ CRC="[0-9.]*?"/i, ' CRC="0"').replace(/OriginalCRC="[0-9.]*?"/i, 'OriginalCRC="0"')
                }
            }
            

        } else {
            notifyAndSetValue('汉化文件未更新，请关注微博"冒险岛M第三汉化委"获取最新消息','false');
            $done({});
        }
    }, reason => {
        notifyAndSetValue(reason.error,'false');
        $done(body);
    });
}

String.prototype.getXmlAttr =function(path,attr){
    var reg = new RegExp(`^(.*Path=\"${path}\"[^\>]*${attr}}=\")(\\d+)(\".*)`)
    return this.replace(reg,'$2')
}
String.prototype.setXmlAttr =function(path,attr,value){
    var reg = new RegExp(`^(.*Path=\"${path}\"[^\>]*${attr}}=\")\\d+(\".*)`)
    return this.replace(reg,`$1${value}$2`)
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
        var mStatus = "HTTP/1.1 302 Found";
        var mHeaders = { "Location": `${github_path}${file_name}` };
        var mResponse = {
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