Messenger.options = {
    extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
    theme: 'flat'
}

function initOutIn(id, email){
    $('#nav-email').text(email);
    $('#nav-in').removeClass('hide');
    $('#nav-noin').addClass('hide');
}

$(document).ready(function(){
	$('#loginHandler').on('click',loginHandler); // login
	$('#regHandler').on('click',regHandler); // register
    $('#outHandler').on('click',outHandler);
});

function loginHandler(){
    var dialog = $.myDialog({
        width:360,
        dd:true,
        lock:true,
        form:true, // 自动清除表单验证的tooltip,关闭时执行
        title:'用户登录',
        content:'<form id="itemForm" action="#" method="post" class="form-horizontal">'+
                    '<div class="form-group">'+
                        '<label for="email" class="col-md-3 control-label">邮&emsp;&emsp;箱:</label>'+
                        '<div class="col-md-9">'+
                            '<input type="text" class="form-control" name="email" id="email" placeholder="邮箱">'+
                        '</div>'+
                    '</div>'+
                    '<div class="form-group">'+
                        '<label for="pwd" class="col-md-3 control-label">密&emsp;&emsp;码:</label>'+
                        '<div class="col-md-9">'+
                            '<input type="password" class="form-control" name="pwd" id="pwd" placeholder="密码">'+
                        '</div>'+
                    '</div>'+
                '</form>',
        btns:[
            {text:'登录',pk:true, handler:function(m,dia){
                if($('#itemForm').valid()) {
                    $.post('/login',$('#itemForm').serialize(),function(data){
                        if(data.succ == 'succ'){
                            m.close();
                            Messenger().post({ message: '登录成功,您可以发表和评论博客.', type: 'info', hideAfter: 3, id: data.id, showCloseButton: true });
                            initOutIn(data.id, data.email)
                        }else{
                            Messenger().post({ message: data[data.succ], type: 'error', hideAfter: 3, showCloseButton: true });
                        }
                    },'json')
                }
            }},
            {text:'取消', close:true}],
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

function regHandler () {
	var dialog = $.myDialog({
        width:400,
        dd:true,
        lock:true,
        form:true, // 自动清除表单验证的tooltip,关闭时执行
        title:'用户注册',
        content:'<form id="itemForm" action="#" method="post" class="form-horizontal">'+
        			'<div class="form-group">'+
        				'<label for="email" class="col-md-3 control-label">邮&emsp;&emsp;箱:</label>'+
    					'<div class="col-md-9">'+
    						'<input type="text" class="form-control" name="email" id="email" placeholder="邮箱">'+
    					'</div>'+
        			'</div>'+
        			'<div class="form-group">'+
        				'<label for="pwd" class="col-md-3 control-label">密&emsp;&emsp;码:</label>'+
    					'<div class="col-md-9">'+
    						'<input type="password" class="form-control" name="pwd" id="pwd" placeholder="密码">'+
    					'</div>'+
        			'</div>'+
        			'<div class="form-group">'+
        				'<label for="repwd" class="col-md-3 control-label">确认密码:</label>'+
    					'<div class="col-md-9">'+
    						'<input type="password" class="form-control" name="repwd" id="repwd" placeholder="确认密码">'+
    					'</div>'+
        			'</div>'+
        		'</form>',
        btns:[
        	{text:'保存',pk:true, handler:function(m,dia){
                if($('#itemForm').valid()) {
                    $.post('/user/reg',$('#itemForm').serialize(),function(data){
                        if(data.succ == 'succ'){
                            m.close();
                            initOutIn(data.id, data.email)
                            Messenger().post({ message: '注册成功,您可以发表和评论博客.', type: 'info', hideAfter: 3, id: data.id, showCloseButton: true });
                        }else{
                            Messenger().post({ message: '注册失败,请稍后再试.', type: 'error', hideAfter: 3, showCloseButton: true });
                        }
                    },'json')
                }
        	}},
        	{text:'取消', close:true}],
        onShow:function() {
            var validate = $('#itemForm').validate({
                rules:{
                    email:{required:true,isEmail:true,remote:{type:'POST',url:'/user/checkEmail'}},
                    pwd:{required:true},
                    repwd:{required:true,equalTo:'#pwd'}
                },
                messages:{
                    email:{remote:'邮箱已经存在,找回密码?'},
                    repwd:{equalTo:'两次密码输入不一致'}
                }
            });
        }      
      });
    dialog.show();
}

function outHandler(){
    $('#nav-in').addClass('hide');
    $('#nav-noin').removeClass('hide');
    Messenger().post({ message: '成功退出!', type: 'info', hideAfter: 3, showCloseButton: true });
    $.post('/user/logout')
}