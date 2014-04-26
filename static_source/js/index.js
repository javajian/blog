$(document).ready(function(){
	$('#loginHandler').on('click',function(){
		alert('登录')
	});
	$('#regHandler').on('click',regHandler);
	// $('#tt').tooltip();
});

function regHandler (argument) {
	var dialog = $.myDialog({
        width:400,
        dd:true,
        lock:true,
        form:true, // 自动清除表单验证的tooltip,关闭时执行
        title:'用户注册',
        content:'<form id="regForm" action="#" method="post" class="form-horizontal">'+
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
                if($('#regForm').valid()) {
                    $.post('/user/reg',$('#regForm').serialize(),function(data){
                        console.info(data)
                    },'json')
                }
        	}},
        	{text:'取消', close:true}]  
      });
	dialog.show();
	// $('#email').myTooltip({content:'从父'});
    var validate = $('#regForm').validate({
        rules:{
            email:{required:true,isEmail:true},
            pwd:{required:true},
            repwd:{required:true,equalTo:'#pwd'}
        },
        messages:{
            repwd:{equalTo:'两次密码输入不一致'}
        }
    });
}

