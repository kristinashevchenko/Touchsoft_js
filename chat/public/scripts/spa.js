/**This module contains function for spa*/
const Spa = (function () {
    let count = 0;
    document.getElementById("tabConf").addEventListener("click", spaDirect.bind(null, "configuration"));
    document.getElementById("tabOperator").addEventListener("click", spaDirect.bind(null, "operator"));
    document.getElementById("tabAbout").addEventListener("click", spaDirect.bind(null, "about"));

    /**Function change url
     * @param {String} str means which page to show*/
    function spaDirect(str) {
        if (count === 0) {
            window.history.pushState(null, null, "spa1.html/" + str);
        } else {
            window.history.replaceState(null, null, str);
        }
        count++;
    }
})()
