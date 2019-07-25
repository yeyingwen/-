const express = require('express');
//引入连接池模块
const pool=require('../pool.js'); 
//创建路由器对象
var router = express.Router();
//1.添加路由
//1.1商品列表
router.get('/list',function(req,res){
	//res.send('商品列表');
	//1获取商品数据
	let obj=req.query;
	let start=0;
	pno=parseInt(obj.pno);
	size=parseInt(obj.size);
	//2判断是否为空
	if(!pno) pno=1;
	if(!size) size=9;
	start=(pno-1)*size;
	//3执行SQL语句
	pool.query('SELECT lid,price,title FROM xz_laptop LIMIT ?,?',[start,size],function(err,result){
		if(err) throw err;
		res.send(result);
	});
});
//2.商品详情
router.get('/detil',function(req,res){
	let obj=req.query;
	let lid=parseInt(obj.lid);
	if(!lid){
		res.send({code:401,msg:'编号不能为空'});
	}

});
//3.商品添加

//4.商品修改


/*
//5.删除商品
router.get('/delete',function(req,res){
	var obj=req.query;
	var laptopId=obj.laptopId;
	laptopId=parseInt(laptopId);
	if(!laptopId){
		res.send('编号不能为空');
		 return ;
	}
	console.log(laptopId);
	pool.query('DELETE FROM xz_laptop WHERE lid=?',[laptopId],function(err,result){
		if(err) throw err;
		//console.log(result);
		if(result.affectedRows>0){
			res.send({code:200,msg:'删除商品成功'});
			//res.send(result);
		}else{
			res.send({code:304,msg:'删除商品失败'});
		}

	});
});
*/


//导出路由器对象
module.exports=router;


