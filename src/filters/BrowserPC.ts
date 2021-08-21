/**
 * @description: 判断当前平台
 * @param {boolean} num   布尔类型
 * @return {*}
 */
const FTgetAgentWebOrIphone = () => {
  // location.reload();
  const sUserAgent: any = navigator.userAgent.toLowerCase();
  const bIsIOS = sUserAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/i) == "ios";  // ios终端
  const bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
  const bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
  const bIsMidp = sUserAgent.match(/midp/i) == "midp";
  const bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
  const bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
  const bIsAndroid = sUserAgent.match(/android/i) == "android";
  const bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
  const bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
  
  if (bIsIpad || bIsAndroid || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsCE || bIsWM) {
    console.log("[浏览设备为]：phone");
    return true
    
  } else {
    console.log("[浏览设备为]：web");
    return false
  }
}

/**
 * @description: 检测平台
 * @param {*}
 * @return {*}
 */
const FTgetWebBrowserTypeInfo = () => {
  let agent: any = navigator.userAgent.toLowerCase();

  let regStr_ie = /msie [\d.]+;/gi;
  let regStr_ff = /firefox\/[\d.]+/gi
  let regStr_chrome = /chrome\/[\d.]+/gi;
  let regStr_saf = /safari\/[\d.]+/gi;
  
  // IE
  if(agent.indexOf("msie") > 0)
  {
    return agent.match(regStr_ie).toString();
  }

  // firefox
  if(agent.indexOf("firefox") > 0)
  {
    return agent.match(regStr_ff).toString();
  }

  // Chrome
  if(agent.indexOf("chrome") > 0)
  {
    let is360js = checkChromeFor360();
    // 判断mime
    function checkChromeFor360() {
      let uas = navigator.userAgent.split(' '),
        result = false;
      // 排除ua自带标志的双核浏览器, 余下chrome,chromium及360浏览器
      if (uas[uas.length - 1].indexOf('Safari') == -1) {
        return result;
      }
      for (let key in navigator.plugins) {
        // np-mswmp.dll文件在chromium及chrome未查询到
        if (navigator.plugins[key].filename == 'np-mswmp.dll') {
            return !result;
        }
      }
      return result;
    }
    // console.log(is360js);
    if(is360js) return "This is 360.";
    else return agent.match(regStr_chrome).toString();
  }

  // Safari
  if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0)
  {
    return agent.match(regStr_saf).toString();
  }

  // 这是Android平台下浏览器
  if(/android/i.test(navigator.userAgent))
  {
    return "This is Android'browser.";
  }

  // 这是iOS平台下浏览器
  if(/(iPhoneiPadiPodiOS)/i.test(navigator.userAgent))
  {
    return "This is iOS'browser.";
  }

  // 这是Linux平台下浏览器
  if(/Linux/i.test(navigator.userAgent))
  {
    return "This is Linux'browser."; 
  }

  // 这是微信平台下浏览器
  if(/MicroMessenger/i.test(navigator.userAgent))
  {
    return "This is MicroMessenger'browser.";
  }
}

// 获取
const FTgetWebBrowserInfo = () => {
  let typeName = FTgetWebBrowserTypeInfo();
  let appName = navigator.appName; // 浏览器的正式名称
  let appVersion = navigator.appVersion; // 浏览器的版本号
  let platform = navigator.platform; // 操作系统平台

  return {
    typeName,
    appName,
    appVersion,
    platform,
  }
}

export {
  FTgetAgentWebOrIphone,
  FTgetWebBrowserInfo
}