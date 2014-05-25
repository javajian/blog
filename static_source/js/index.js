Messenger.options = {
    extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
    theme: 'flat'
}

var i18n = {
    zh:{
        userLogin:'用户登录',
        userReg:'用户注册',
        email:'邮箱',
        pwd:'密码',
        repwd:'确认密码',
        loginBtn:'登录',
        cancelBtn:'取消',
        saveBtn:'保存',
        vremote:'邮箱已经存在,找回密码?',
        vequalTo:'两次密码输入不一致',
        logout:"成功退出!",
        err404:'请求的路径不存在!',
        err500:'服务器出错,请稍后再试!',
        errtimeout:'服务器超时,请稍后再试!',
        notLogin:'您还没有登录,登录后发表博客!'

    },
    en:{
        userLogin:'User Login',
        userReg:'User Register',
        email:'Email',
        pwd:'Password',
        repwd:'Confirm',
        loginBtn:'Login',
        cancelBtn:'Cancel',
        saveBtn:'Save',
        vremote:'exists! please change another, or find the password?',
        vequalTo:'Entered passwords differ',
        logout:"logout succeed",
        err404:'The requested resource does not exist!',
        err500:'Internal Server Error,Please try again later!',
        errtimeout:'Request timed out,Please try again later!',
        notLogin:'You are not logged, After Logging, you can post you blog!'
    }
};

var showTip = function(options){
    var defaults = {
        msg:'消息',
        type:'error',
        time:3,
        showCloseButton:true,
        id:''
    };
    var opts = $.extend({},defaults,options);
    Messenger().post({id:opts.id,message: opts.msg, type: opts.type, hideAfter: opts.time, showCloseButton: opts.showCloseButton });
};

var errorFun = function(xhr) {
    if(xhr.status == 404) 
        showTip({msg:i18n[lan].err404});
    if(xhr.status == 500)
        showTip({msg:i18n[lan].err500});
    if(xhr.status == -1)
        showTip({msg:i18n[lan].errtimeout});
};

function initOutIn(id, email){
    $('#nav-email').text(email);
    $('#nav-in').removeClass('hide');
    $('#nav-noin').addClass('hide');
}

$(document).ready(function(){
	$('#loginHandler').on('click',loginHandler); // login
	$('#regHandler').on('click',regHandler); // register
    $('#outHandler').on('click',outHandler);
    // change locale and reload page
    $(document).on('click', '.lang-changed', function(){
        var $e = $(this);
        var lang = $e.data('lang');
        $.cookie('lang', lang, {path: '/', expires: 365});
        window.location.reload();
    });
    $('#main').css('padding-top',$('#topNav').height()+'px');
    $(window).on('resize',function(){
        $('#main').css('padding-top',$('#topNav').height()+'px');
    });
});

function loginHandler(callback){
    var dialog = $.myDialog({
        width:360,
        dd:true,
        lock:true,
        form:true, // 自动清除表单验证的tooltip,关闭时执行
        title:i18n[lan].userLogin,
        content:'<form id="itemForm" action="#" method="post" class="form-horizontal">'+
                    '<div class="form-group">'+
                        '<label for="email" class="col-md-3 control-label">'+i18n[lan].email+':</label>'+
                        '<div class="col-md-9">'+
                            '<input type="text" value="admin@qq.com" class="form-control" name="email" id="email" placeholder="'+i18n[lan].email+'">'+
                        '</div>'+
                    '</div>'+
                    '<div class="form-group">'+
                        '<label for="pwd" class="col-md-3 control-label">'+i18n[lan].pwd+':</label>'+
                        '<div class="col-md-9">'+
                            '<input type="password" value="123" class="form-control" name="pwd" id="pwd" placeholder="'+i18n[lan].pwd+'">'+
                        '</div>'+
                    '</div>'+
                '</form>',
        btns:[
            {text:i18n[lan].loginBtn,pk:true, handler:function(m,dia){
                if($('#itemForm').valid()) {
                    $.post('/doLogin',$('#itemForm').serialize(),function(data){
                        if(data.succ == 'succ'){
                            m.close();
                            showTip({msg:'登录成功,您可以发表和评论博客.',type:'info',id:data.id})
                            initOutIn(data.id, data.email)
                            if(callback && typeof callback == 'function') {
                                callback(data);
                            }
                        }else{
                            showTip({msg:data[data.succ]});
                        }
                    },'json')
                }
            }},
            {text:i18n[lan].cancelBtn, close:true}],
        onShow:function() {
            var validate = $('#itemForm').validate({
                rules:{
                    email:{required:true,isEmail:true},
                    pwd:{required:true}
                }
            });
        }      
    });    
    dialog.show();
}

function regHandler (callback) {
	var dialog = $.myDialog({
        width:400,
        dd:true,
        lock:true,
        form:true, // 自动清除表单验证的tooltip,关闭时执行
        title:i18n[lan].userReg,
        content:'<form id="itemForm" action="#" method="post" class="form-horizontal">'+
        			'<div class="form-group">'+
        				'<label for="email" class="col-md-3 control-label">'+i18n[lan].email+':</label>'+
    					'<div class="col-md-9">'+
    						'<input type="text" class="form-control" name="email" id="email" placeholder="'+i18n[lan].email+'">'+
    					'</div>'+
        			'</div>'+
        			'<div class="form-group">'+
        				'<label for="pwd" class="col-md-3 control-label">'+i18n[lan].pwd+':</label>'+
    					'<div class="col-md-9">'+
    						'<input type="password" class="form-control" name="pwd" id="pwd" placeholder="'+i18n[lan].pwd+'">'+
    					'</div>'+
        			'</div>'+
        			'<div class="form-group">'+
        				'<label for="repwd" class="col-md-3 control-label">'+i18n[lan].repwd+':</label>'+
    					'<div class="col-md-9">'+
    						'<input type="password" class="form-control" name="repwd" id="repwd" placeholder="'+i18n[lan].repwd+'">'+
    					'</div>'+
        			'</div>'+
        		'</form>',
        btns:[
        	{text:i18n[lan].saveBtn,pk:true, handler:function(m,dia){
                if($('#itemForm').valid()) {
                    $.post('/user/reg',$('#itemForm').serialize(),function(data){
                        if(data.succ == 'succ'){
                            m.close();
                            initOutIn(data.id, data.email)
                            showTip({msg:'注册成功,您可以发表和评论博客.',type:'info',id:data.id})
                            if(callback && typeof callback == 'function') {
                                callback(data);
                            }
                        }else{
                            showTip({msg:'注册失败,请稍后再试.'});
                        }
                    },'json')
                }
        	}},
        	{text:i18n[lan].cancelBtn, close:true}],
        onShow:function() {
            var validate = $('#itemForm').validate({
                rules:{
                    email:{required:true,isEmail:true,remote:{type:'POST',url:'/user/checkEmail'}},
                    pwd:{required:true},
                    repwd:{required:true,equalTo:'#pwd'}
                },
                messages:{
                    email:{remote:i18n[lan].vremote},
                    repwd:{equalTo:i18n[lan].vequalTo}
                }
            });
        }      
      });
    dialog.show();
}

function outHandler(){
    $('#nav-in').addClass('hide');
    $('#nav-noin').removeClass('hide');
    showTip({msg:i18n[lan].logout,type:'info'});
    $.post('/user/logout')
}