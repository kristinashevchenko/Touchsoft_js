/**This module contains function for configuration page*/
const Config = (function () {
    document.getElementById("config-form").addEventListener("change", formChanged);
    document.getElementById("copyCode").addEventListener("click", copyCode);
    document.getElementById("config-form").setAttribute("onsubmit", "return false");

    /**This function generates configuration code,which you can paste in html-page
     * @returns {String} string with configuration code*/
    function formChanged() {
        let chat = {
            title: document.getElementById("chatTitle").value ? document.getElementById("chatTitle").value : "Touchsoft support",
            botName: document.getElementById("botName").value ? document.getElementById("botName").value : "Bot",
            cssClass: document.getElementById("chatCSS").value ? document.getElementById("chatCSS").value : "violet",
            position: document.getElementById("chatPosition").value ? document.getElementById("chatPosition").value : "Right",
            allowMinimize: document.getElementById("allowMinim").checked ? true : false,
            allowDrag: document.getElementById("allowDrag").checked ? true : false,
            showDateTime: document.getElementById("showDate").checked ? true : false,
            requireName: document.getElementById("reqName").checked ? true : false,
            requests: document.getElementById("inlineRadio1").checked ? true : false,
            longpolling: document.getElementById("updatesRadio1").checked ? true : false,
        }
        let str;
        if (!chat.longpolling)
            str = `<script src="socket.io/socket.io.js"></script>
<script src="scripts/module.js"></script>
<script src="scripts/refetch.js"></script>
<script>
    let ts=new Chat.TSChat({
    title:"${chat.title}",
    botName:"${chat.botName}",
    cssClass:"${chat.cssClass}",
    position:"${chat.position}",
    allowMinimize:${chat.allowMinimize},
    allowDrag:${chat.allowDrag},
    showDataTime:${chat.showDateTime},
    requireName:${chat.requireName},
    requests:${chat.requests},
    longpolling:${chat.longpolling},
    });
</script>`;
        else {
            str = `<script src="socket.io/socket.io.js"></script>
<script src="scripts/module.js"></script>
<script src="scripts/longpolling.js"></script>
<script>
    let ts=new Chat.TSChat({
    title:"${chat.title}",
    botName:"${chat.botName}",
    cssClass:"${chat.cssClass}",
    position:"${chat.position}",
    allowMinimize:${chat.allowMinimize},
    allowDrag:${chat.allowDrag},
    showDataTime:${chat.showDateTime},
    requireName:${chat.requireName},
    requests:${chat.requests},
    longpolling:${chat.longpolling},
    });
</script>`;
        }
        document.getElementById("useCode").value = str;
        return str;
    }

    /**Select code in textarea*/
    function copyCode() {
        document.getElementById("useCode").focus();
        document.getElementById("useCode").select();
    }
})()

