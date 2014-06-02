package models

import (
	"blog/observer"
	"fmt"
	"github.com/Unknwon/com"
	"github.com/Unknwon/goconfig"
	"github.com/astaxie/beego"
	// "github.com/astaxie/beego/toolbox"
	_ "github.com/go-sql-driver/mysql"
	"github.com/go-xorm/xorm"
	"os"
	"time"
)

/* 用户表 */
type User struct {
	Id          int64     // 主键
	Uname       string    `xorm:"VARCHAR(30) unique"` // 用户名
	Pwd         string    `xorm:"VARCHAR(50)"`        // 密码
	Mobile      string    `xorm:"VARCHAR(11)"`        //手机号
	Email       string    `xorm:"index"`              // 邮箱
	Real        string    `xorm:"VARCHAR(20)"`        // 真实姓名
	Nick        string    `xorm:"VARCHAR(20)"`        // 昵称
	Head        string    `xorm:"VARCHAR(100)"`       // 头像图片地址
	Sex         int8      // 性别 1男 2女 0其他
	Province    int64     // 省
	City        int64     // 市
	Town        int64     // 县
	Sign        string    `xorm:"VARCHAR(255)"` // 个性签名
	Place       string    `xorm:"VARCHAR(255)"` // 注册位置
	Reged       time.Time // 注册时间
	Utype       int       // 用户类型0一般用户 1管理员
	LastLogined time.Time `xorm:"'lastLogined' default null"` // 最后登陆时间
	LockStarted time.Time `xorm:"'lockStarted' default null"` // 被锁定用户开始时间
	LockEnded   time.Time `xorm:"'lockEnded' default null"`   // 结束时间
	State       int       // 锁定or正常
	Score       int64     // 积分
	Lv          int       // 级别
	Exp         int       // 经验值
	Birth       time.Time // 生日
}

/* 博客表 */
type Blog struct {
	Id         int64     //主键
	Title      string    `xorm:"VARCHAR(100)"` //标题
	Content    string    `xorm:"longtext"`     //内容
	Uid        int64     //作者
	Created    time.Time //创建时间
	Attachment string    `xorm:"VARCHAR(300)"` // 附件
	Views      int       //浏览量
	Replys     int       //回复量,评论数
	State      int       //状态:0正常发表 1禁止发表(冻结) 2删除
	CanComment int       `xorm:"'canComment'"` // 是否可以回复 0 正常 1不能
	Tag        string    `xorm:"VARCHAR(100)"` // 标签 spring web java 等
	ChannelId  int64     `xorm:"'channelId'"`  // 所属栏目
	CategoryId int64     `xorm:"'categoryId'"`
}

/* 类别表 */
type Category struct {
	Id      int64
	Name    string
	Created time.Time
}

/* 用户类别表,用户发表什么样的类别的文章,就给用户增加一个类别,当用户登录时,按照类别获取相关的文章 */
type UserCategory struct {
	Id         int64
	Uid        int64 `xorm:"'uid'"`
	CategoryId int64 `xorm:"'categoryId'"`
}

/* 评论和回复 */
type Comment struct {
	Id      int64     //主键
	Content string    `xorm:"VARCHAR(300)"` //内容
	Created time.Time //创建时间
	Uid     int64     //创建人
	BlogId  int64     `xorm:"'blogId'"` //评论的博客
	Pid     int64     // 针对评论的回复
	Level   int       // 回复的层级,比如超过10次就不让回复了
}

type Tag struct {
	Id      int64
	Name    string `xorm:"VARCHAR(20)"`
	Uid     int64
	Created time.Time
}

/* 频道 */
type Channel struct {
	Id      int64     //主键
	Scn     string    // 唯一的编号
	Pcsn    string    //上级编号
	Name    string    // 栏目名称
	Show    int       //展示位置 0首页 1..
	Created time.Time //创建时间
}

func (uc *UserCategory) TableName() string {
	return "userCategory"
}

const (
	_CFG_PATH = "conf/app.conf"
)

var (
	x   *xorm.Engine
	Cfg *goconfig.ConfigFile
)

func setEngine() {

	dbName := Cfg.MustValue("db", "name")
	dbPwd := Cfg.MustValue("db", "pwd")

	var err error
	x, err = xorm.NewEngine("mysql", fmt.Sprintf("%v:%v@%v/%v?charset=utf8",
		Cfg.MustValue("db", "user"), dbPwd,
		Cfg.MustValue("db", "host"), dbName))
	if err != nil {
		beego.Error("models.init -> fail to conntect database:", err)
	}

	if beego.RunMode != "pro" {
		x.ShowDebug = true
		x.ShowErr = true
		x.ShowSQL = true
	}

	beego.Trace("Initialized database ->", dbName)
}

// InitDb initializes the database.
func initDb() {
	setEngine()
	x.Sync(new(User), new(Blog), new(Category), new(UserCategory), new(Comment), new(Tag))
}

func InitModels() {
	if !com.IsFile(_CFG_PATH) {
		fmt.Println("app.ini文件不存在,创建..")
		os.Create(_CFG_PATH)
	}
	var err error
	Cfg, err = goconfig.LoadConfigFile(_CFG_PATH)
	if err == nil {
		beego.Info("Initialize app.conf")
	} else {
		fmt.Println(err)
		os.Exit(2)
	}

	// 初始化xorm引擎
	initDb()
	initObserver()
	// 添加一个定时任务
	// task0 := toolbox.NewTask("first task", "0 */2 * * * *", firstTask)
	// toolbox.AddTask("first task", task0)
	// toolbox.StartTask()
	// task1 := toolbox.NewTask("first task", "0 */1 * * * *", sendTask)
	// toolbox.AddTask("send task", task1)
}

// func firstTask() error {
// 	fmt.Println("task0: ", time.Now())
// 	return nil
// }

// func sendTask() error {
// 	fmt.Println("task1: ", time.Now())
// 	return nil
// }

func FindAllUsers() []*User {
	users := make([]*User, 0)
	x.Desc("id").Find(&users)
	return users
}

func FindUserByEmail(email string) (user *User, has bool, err error) {
	user = new(User)
	has, err = x.Where("email = ?", email).Get(user)
	return
}

func SaveUser(u *User) (int64, error) {
	id, err := x.Insert(u)
	return id, err
}

func CheckEmail(email string) (int64, error) {
	user := new(User)
	total, err := x.Where("email = ?", email).Count(user)
	return total, err
}

func SaveBlog(b *Blog) (id int64, err error) {
	session := x.NewSession()
	defer session.Close()
	err = session.Begin()
	id, err = session.Insert(b)
	if err != nil {
		beego.Error(err)
		session.Rollback()
		return
	}

	params := make(map[string]interface{})
	b.Id = id
	params["blog"] = b
	params["session"] = session
	dispatcher.DispatchEvent(observer.CreateEvent("saveBlog", params))
	err = session.Commit()
	if err != nil {
		beego.Error(err)
		return
	}
	return
}
