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
        title:'用户注册',
        content:'<form id="regForm" action="#" class="form-horizontal">'+
        			'<div class="form-group">'+
        				'<label for="email" class="col-md-3 control-label">邮&emsp;&emsp;箱:</label>'+
    					'<div class="col-md-9">'+
    						'<input type="text" class="form-control" id="email" placeholder="邮箱">'+
    					'</div>'+
        			'</div>'+
        			'<div class="form-group">'+
        				'<label for="pwd" class="col-md-3 control-label">密&emsp;&emsp;码:</label>'+
    					'<div class="col-md-9">'+
    						'<input type="password" class="form-control" id="pwd" placeholder="密码">'+
    					'</div>'+
        			'</div>'+
        			'<div class="form-group">'+
        				'<label for="repwd" class="col-md-3 control-label">确认密码:</label>'+
    					'<div class="col-md-9">'+
    						'<input type="password" class="form-control" id="repwd" placeholder="确认密码">'+
    					'</div>'+
        			'</div>'+
        		'</form>',
        btns:[
        	{text:'保存',pk:true, handler:function(m,dia){
        		if($('#regForm').valid()){
                    alert('save');
                }else{
                    alert('err')
                }
				m.close();
        	}},
        	{text:'取消', close:true}]
      });
	dialog.show();
	// $('#email').myTooltip({content:'从父'});
    $('#regForm').validate({
        rules:{
            email:{
                required:true,
                email:true
            }
        },
        errorPlacement: function(error, element) {
            console.info(error)
            console.info(element)
        },
    });
}

