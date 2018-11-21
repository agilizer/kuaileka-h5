import Vue from 'vue'

//Vue.filter('hideIDcardMiddle', function(val) {
//  return `${val.substring(0,4)}****${val.substring(val.length-4)}`
//})

Vue.filter('hideOverLengthMiddle', function(val) {
    if(val.length > 20) {
        return `${val.substring(0,8)}...${val.substring(val.length-8)}`
    }
    return val
})

Vue.filter('sizeConversion', function(val) {
    if(val > (1024 * 1024)) {
        return(val / (1024 * 1024)).toFixed(2) + 'MB'
    }
    return parseInt(val / 1024) + 'KB';
})