//创建路由器,添加注册路由（post,/reg），导出路由器，在服务器下引入并挂载到/user  ->  /user/reg
//引用  require(./routes/user.js);
//引入连接池模块
const pool=require('../pool.js'); 
const express = require('express');
//创建路由对象
var router = express.Router();
//添加路由
//1.用户注册
router.post('/reg',function(req,res){
	//1.获取post请求数据
	var obj = req.body;
	console.log(obj);
	//2.验证数据是否为空
	if(!obj.uname){
		res.send({code:401,msg:'用户名不能为空'});
		return ;	//出错后阻止往后执行
	}	
	if(!obj.upwd){
		res.send({code:402,msg:'密码不能为空'});
		return ;	//出错后阻止往后执行
	}	
	if(!obj.email){
		res.send({code:403,msg:'邮箱不能为空'});
		return ;	//出错后阻止往后执行
	}
	if(!obj.phone){
		res.send({code:404,msg:'手机号码不能为空'});
		return ;	//出错后阻止往后执行
	}
	//3.执行SQL语句
	pool.query('INSERT INTO xz_user SET ?',[obj],function(err,result){
		if(err) throw err;
		console.log(result);
		//如果注册成功
		if(result.affectedRows>0)
		res.send({code:200,msg:'register sucess'});
	});
	//res.send('注册成功');
});
//2.用户登录
router.post('/login',function(req,res){
	//1.获取post请求数据
	var obj = req.body;
	console.log(obj);
	//2.验证数据是否为空
	if(!obj.uname){
		res.send({code:401,msg:'用户名不能为空'});
		return ;	//出错后阻止往后执行
	}	
	if(!obj.upwd){
		res.send({code:402,msg:'密码不能为空'});
		return ;	//出错后阻止往后执行
	}	
	//3.执行SQL语句
	pool.query('SELECT * FROM xz_user WHERE uname=? AND upwd=?',[obj.uname,obj.upwd],function(err,result){
		if(err)  throw err;
		console.log(result);
		//判断登录是否成功
		if(result.length>0){
			res.send({code:200,msg:'欢迎回来！'});
		}else{
			res.send({code:301,msg:'用户名或者密码错误！'});
		}
	});
});
//3.用户检索
router.get('/detail',function(req,res){
	var obj=req.query;
	//console.log(obj);
	if(!obj.uid){
		res.send({code:401,msg:'编号不能为空'});
		return ;
	} 
	pool.query('SELECT * FROM xz_user WHERE uid=?',[obj.uid],function(err,result){
			if(err) throw err;
		if(result.length>0){
			//res.send( result[0] );
			res.send(`查询到的用户：<br>
			编号：${result[0].uid}<br>
			用户名：${result[0].uname}<br>
			密码：：${result[0].upwd}<br>
			邮箱：：${result[0].email}<br>
			手机：：${result[0].phone}<br>
			真实姓名：${result[0].user_name}<br>
			性别：${result[0].gender}<br>
			`);
		}else{
			res.send({code:301,msg:'用户编号不存在'});
		}
	});
});
//4.修改用户资料
router.get('/update',function(req,res){
	//获取数据
	var obj=req.query;
	//console.log(obj);
	//验证数据是否为空
	var num=401;
	for(var key in obj){
		//console.log(key,obj[key]);
		//如果属性值为空，则提示属性名是必须的
		if( !obj[key] ){
			res.send({code:num,msg:key+'不能为空'});
			return ;
		}	
		num++;
	}
	//执行SQL语句，修改数据
	//pool.query('UPDATE xz_user SET uname=?,phone=?,email=?,gender=? WHERE uid=?',[obj.uname,obj.phone,obj.email,obj.gender,obj.uid],function(err,result){
	pool.query('UPDATE xz_user SET ? WHERE uid=?',[obj,obj.uid],function(err,result){
		if(err) throw err;
		//console.log(result);
		if(result.affectedRows>0){
			res.send({code:200,msg:'成功修改用户资料'});
			return;
		}else{
			res.send({code:301,msg:'修改用户资料失败'});
		}
	});
});

//5.查询用户列表
router.get('/list',function(req,res){
	var obj=req.query;
	console.log(obj);
	var start=0;
	size=parseInt(obj.size);
	pno=parseInt(obj.pno);
	if(!pno)  pno=1;
	if(!size) size=3;
	start=(pno-1)*size;
	pool.query('SELECT * FROM xz_user LIMIT ?,?',[start,size],function(err,result){
		if(err) throw err;
		res.send(result);
	});
});
//6. 删除用户
router.get('/delete',function(req,res){
	//1.获取数据
	var obj=req.query;
	var id=parseInt(obj.uid);
	//2.验证数据
	if(!id){
		res.send({code:401,msg:'编号不能为空'});
		return ;
	}
	//3.执行SQL语句
	pool.query('DELETE FROM xz_user WHERE uid=?',[id],function(err,result){
		if(err) throw err;
		console.log(result);
		if(result.affectedRows>0){
			res.send({code:200,msg:'删除用户成功'});
		}else{
			res.send({code:304,msg:'删除用户失败'});
		}
	});
});


//导出路由器对象
module.exports=router;






