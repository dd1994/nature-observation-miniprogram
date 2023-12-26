● user 用户
● Taxon 物种
● observation 观察：可包含照片/视频/音频和备注
● observationSet 观察集: 多个观察的合集，可多人协作，比如20203-07-08夜观观察集/20203-07-08西天目山徒步观察集；
● project  项目: 可包含多个观察和多个观察集，可多人协作；比如西溪湿地生物多样性调查；
● identifications 鉴定
● comments: 评论：可对观察/观察集/鉴定进行评论

observation 观察:
// 1. 基础信息
id	观察主键 id		
userId	用户		
description	描述		
observed_on	观察时间		
updated_at	更新时间		
created_at	创建时间
// 2. 地理位置
latitude	经度
longitude	纬度	
province	省	
city	市	
district	县/区	
recommend_name	推荐展示位置名	
standard_address	标准位置名	
// 3. 物种信息	
common_name	物种名
scientific_name	拉丁名	
iconic_taxon_name	类群名称，如鸟类/昆虫/两栖类等	
taxon_id	物种 id
// 4. 其它信息
license	授权协议