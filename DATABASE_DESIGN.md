# 智慧社区康养系统 - 数据库设计文档

> **版本**: 1.0  
> **设计者**: 20年经验系统架构师  
> **日期**: 2026-01-17  
> **说明**: 本文档基于现有前端页面逻辑反推设计，旨在构建一个结构清晰、扩展性强且符合老年人康养业务需求的数据库模型。

---

## 1. 设计原则
1.  **以人为本**：核心围绕“会员（Member）”及其关联数据（健康、照护、消费、安全）展开。
2.  **安全性**：敏感数据（如密码、支付密码）需加密存储。
3.  **可扩展性**：预留字段以支持未来接入更多智能设备或服务类型。
4.  **规范命名**：表名和字段名采用小写蛇形命名法（snake_case），并附带详细中文注释。

---

## 2. E-R 关系图概览 (文字版)
*   **Member (会员)**
    *   1 : N -> **HealthRecord (健康数据)**
    *   1 : N -> **Assessment (评估报告)**
    *   1 : N -> **CareTask (照护任务)**
    *   1 : N -> **Order (订单)**
    *   1 : N -> **Device (设备)**
    *   1 : N -> **EmergencyContact (紧急联系人)**
    *   1 : N -> **Transaction (钱包流水)**

---

## 3. 详细表结构设计

### 3.1 用户与基础信息模块

#### `members` - 会员基本信息表
存储会员的核心身份信息、账户余额及居住信息。

| 字段名 | 类型 | 必填 | 说明 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT | 是 | 主键，自增ID | 10001 |
| `phone` | VARCHAR(20) | 是 | 登录手机号 (唯一索引) | 13800138000 |
| `password_hash` | VARCHAR(255) | 是 | 登录密码哈希 | (加密字符串) |
| `name` | VARCHAR(50) | 是 | 真实姓名 | 张建国 |
| `avatar` | VARCHAR(255) | 否 | 头像URL | /images/avatar_01.jpg |
| `gender` | TINYINT | 是 | 性别 (1:男, 2:女) | 1 |
| `age` | INT | 否 | 年龄 (可由出生日期计算，此处为缓存) | 76 |
| `birthday` | DATE | 否 | 出生日期 | 1948-03-12 |
| `id_card` | VARCHAR(20) | 否 | 身份证号 (需加密存储) | 110101... |
| `blood_type` | VARCHAR(5) | 否 | 血型 | A |
| `allergies` | TEXT | 否 | 过敏史 | 青霉素, 芒果 |
| `balance` | DECIMAL(10,2) | 是 | 账户余额 | 1250.00 |
| `address_hukou` | VARCHAR(255) | 否 | 户籍地址 | 北京市朝阳区... |
| `address_current` | VARCHAR(255) | 否 | 现居地址 | 北京市朝阳区... |
| `created_at` | DATETIME | 是 | 注册时间 | 2024-01-01 10:00:00 |

#### `emergency_contacts` - 紧急联系人表
用于一键呼救和紧急情况联系。

| 字段名 | 类型 | 必填 | 说明 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT | 是 | 主键 | 1 |
| `member_id` | BIGINT | 是 | 关联会员ID | 10001 |
| `name` | VARCHAR(50) | 是 | 联系人姓名 | 张伟 |
| `relation` | VARCHAR(20) | 是 | 关系 (如: 长子, 配偶) | 长子 |
| `phone` | VARCHAR(20) | 是 | 联系电话 | 13900008888 |
| `is_primary` | TINYINT | 是 | 是否第一联系人 (0:否, 1:是) | 1 |

---

### 3.2 健康与照护模块

#### `health_records` - 健康监测记录表
存储血压、血糖等日常监测数据。

| 字段名 | 类型 | 必填 | 说明 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT | 是 | 主键 | 1 |
| `member_id` | BIGINT | 是 | 关联会员ID | 10001 |
| `type` | VARCHAR(20) | 是 | 数据类型 (bp:血压, bg:血糖) | bp |
| `value_1` | DECIMAL(5,1) | 是 | 主值 (收缩压/空腹血糖) | 128 |
| `value_2` | DECIMAL(5,1) | 否 | 副值 (舒张压/餐后血糖) | 82 |
| `unit` | VARCHAR(10) | 否 | 单位 | mmHg |
| `status` | VARCHAR(20) | 是 | 状态 (normal:正常, high:偏高, low:偏低) | normal |
| `measured_at` | DATETIME | 是 | 测量时间 | 2024-01-15 08:30:00 |

#### `assessments` - 健康评估报告表
存储专业的健康评估结果。

| 字段名 | 类型 | 必填 | 说明 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT | 是 | 主键 | 1 |
| `member_id` | BIGINT | 是 | 关联会员ID | 10001 |
| `title` | VARCHAR(100) | 是 | 评估名称 | ADL日常生活能力评估 |
| `score` | INT | 是 | 评分 | 85 |
| `result` | VARCHAR(100) | 是 | 评估结论 | 轻度依赖 |
| `advice` | TEXT | 否 | 医生/专家建议 | 建议加强下肢力量... |
| `assessor` | VARCHAR(50) | 是 | 评估人姓名 | 李华 (主任医师) |
| `assessed_at` | DATE | 是 | 评估日期 | 2023-10-15 |

#### `care_tasks` - 照护计划任务表
每日的照护服务安排。

| 字段名 | 类型 | 必填 | 说明 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT | 是 | 主键 | 1 |
| `member_id` | BIGINT | 是 | 关联会员ID | 10001 |
| `service_name` | VARCHAR(100) | 是 | 服务名称 | 晨间护理 |
| `start_time` | DATETIME | 是 | 计划开始时间 | 2024-01-15 08:00:00 |
| `end_time` | DATETIME | 是 | 计划结束时间 | 2024-01-15 08:30:00 |
| `staff_name` | VARCHAR(50) | 否 | 服务人员 | 李阿姨 |
| `status` | VARCHAR(20) | 是 | 状态 (pending:待办, completed:完成, missed:未完成) | completed |

---

### 3.3 商城与订单模块

#### `products` - 商品/服务表
商城可购买的实物或服务。

| 字段名 | 类型 | 必填 | 说明 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT | 是 | 主键 | 1 |
| `category` | VARCHAR(20) | 是 | 分类 (meal:配餐, grocery:百货, service:服务) | meal |
| `name` | VARCHAR(100) | 是 | 商品名称 | 营养午餐套餐 A |
| `price` | DECIMAL(10,2) | 是 | 单价 | 25.00 |
| `description` | TEXT | 否 | 描述 | 适合糖尿病人群... |
| `stock` | INT | 是 | 库存 | 999 |
| `is_active` | TINYINT | 是 | 是否上架 | 1 |

#### `orders` - 订单主表

| 字段名 | 类型 | 必填 | 说明 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| `id` | VARCHAR(32) | 是 | 订单号 (主键) | ORD202401150001 |
| `member_id` | BIGINT | 是 | 关联会员ID | 10001 |
| `total_amount` | DECIMAL(10,2) | 是 | 订单总金额 | 25.00 |
| `status` | VARCHAR(20) | 是 | 状态 (pending:待支付, paid:已支付, shipping:配送中, completed:已完成, refunded:已退款) | pending |
| `payment_method` | VARCHAR(20) | 否 | 支付方式 (wechat, alipay, balance, help) | balance |
| `created_at` | DATETIME | 是 | 下单时间 | 2024-01-15 10:30:00 |

#### `order_items` - 订单明细表

| 字段名 | 类型 | 必填 | 说明 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT | 是 | 主键 | 1 |
| `order_id` | VARCHAR(32) | 是 | 关联订单号 | ORD202401150001 |
| `product_id` | BIGINT | 是 | 关联商品ID | 1 |
| `quantity` | INT | 是 | 数量 | 1 |
| `price` | DECIMAL(10,2) | 是 | 下单时单价 | 25.00 |

---

### 3.4 设备与消息模块

#### `devices` - 智能设备表

| 字段名 | 类型 | 必填 | 说明 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT | 是 | 主键 | 1 |
| `member_id` | BIGINT | 是 | 关联会员ID | 10001 |
| `type` | VARCHAR(20) | 是 | 设备类型 (watch, smoke, sleep_band) | watch |
| `name` | VARCHAR(50) | 是 | 设备名称 | 智能手环 |
| `device_sn` | VARCHAR(50) | 是 | 设备序列号 | SN12345678 |
| `status` | VARCHAR(20) | 是 | 状态 (online, offline, warning) | online |
| `battery` | INT | 否 | 电量百分比 | 75 |
| `location` | VARCHAR(50) | 否 | 安装位置 | 客厅 |

#### `notifications` - 系统通知表

| 字段名 | 类型 | 必填 | 说明 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT | 是 | 主键 | 1 |
| `type` | VARCHAR(20) | 是 | 类型 (important, activity, service) | important |
| `title` | VARCHAR(100) | 是 | 标题 | 免费体检通知 |
| `content` | TEXT | 是 | 内容 | 本周六上午... |
| `target_scope` | VARCHAR(20) | 是 | 发送范围 (all:全员, personal:个人) | all |
| `event_time` | DATETIME | 否 | 活动时间 | 2024-01-20 09:00:00 |
| `created_at` | DATETIME | 是 | 发布时间 | 2024-01-15 08:00:00 |

---

## 4. 扩展性说明
1.  **多租户支持**：如果系统需要支持多个社区，可以在所有表中增加 `community_id` 字段。
2.  **权限控制**：后台管理端需要单独设计 `admins` 和 `roles` 表，此处仅包含会员端结构。
3.  **日志记录**：建议增加 `operation_logs` 表，记录用户的关键操作（如登录、支付、修改信息）。
