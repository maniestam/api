const errMessageJoi = function(e){   
    var errMessaged = e[0].context.key + ' is required';
        if(typeof e[0].context.value == 'string'){
             if(e[0].context.value.length==0){
                errMessaged = e[0].context.key + ' is required';
             }else{
                errMessaged = e[0].context.key + ' must be a number';
             }
        }else{
            if(e[0].context.value < e[0].context.limit){
                errMessaged = e[0].context.key + ' is min ';
            }
        }
       return errMessaged;
};
module.exports = {errMessageJoi};