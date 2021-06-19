/*
冒险岛M版本监控
监控资源版本与服务器版本
查看汉化情况
商店版
[task_local]
*\/5 * * * * VersionMonitor.js
远程
[task_local]
*\/5 * * * * https://raw.githubusercontent.com/MapleRen/MapleStoryM-language/master/Kor/QuantumultX/VersionMonitor.js
*/

var config = {
  kor: {
    name: "🇰🇷",
    url:
      "http://mm-staticweb.s3.amazonaws.com/MarketVersions/KoreaLiveMarketVersion.xml",
    version: "msm_kor_version",
    server: "msm_kor_server",
  },
  jp: {
    name: "🇯🇵",
    url:
      "http://nxm-maplemjp-staticweb.s3.amazonaws.com/MarketVersions/Japan/JapanLiveMarketVersion.xml",
    version: "msm_jp_version",
    server: "msm_jp_server",
  },
};
var path = "AppStore/";

function watchVersion(obj) {
  var req = {
    url: obj.url,
    method: "GET",
  };
  $task.fetch(req).then(
    (response) => {
      // response.statusCode, response.headers, response.body
      var body = response.body;
      var temp = getValue(body, path, 1);
      var lastedVersion = temp.slice(0, temp.indexOf("/"));
      var oldVersion = $prefs.valueForKey(obj.version);
      if (oldVersion != lastedVersion) {
        $prefs.setValueForKey(lastedVersion, obj.version);
        $notify(
          "冒险岛M版本监控",
          obj.name + "资源版本已更新",
          oldVersion + " → " + lastedVersion
        );
      }
      var lastedServer = getValue(body, 'Server="', 3);
      var oldServer = $prefs.valueForKey(obj.server);
      if (oldServer != lastedServer) {
        $prefs.setValueForKey(lastedServer, obj.server);
        $notify(
          "冒险岛M版本监控",
          obj.name + "服务器版本已更新",
          oldServer + " → " + lastedServer
        );
      }
    },
    (reason) => {
      // reason.error
    }
  );
}

function getValue(str, path, times) {
  for (i = 0; i < times; i++) {
    var index = str.indexOf(path) + path.length;
    str = str.slice(index);
  }
  var temp = str.slice(0, str.indexOf('"'));
  return temp;
}

watchVersion(config.kor);
watchVersion(config.jp);
