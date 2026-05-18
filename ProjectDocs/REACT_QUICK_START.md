# React 组件快速使用指南

## 🚀 快速开始

### 第 1 步：查看新组件
新组件已创建在：
```
/Users/mike/Documents/AIFactory/Code/components/forms/form-generator-v2.tsx
```

### 第 2 步：使用新组件
在你的页面中导入并使用：

```tsx
// 导入新组件
import FormGeneratorV2 from "@/components/forms/form-generator-v2";

// 使用
export default function CreateFormPage() {
  const canCreate = true; // 从用户订阅状态获取
  
  return (
    <div className="container mx-auto py-8">
      <FormGeneratorV2 canCreate={canCreate} />
    </div>
  );
}
```

---

## 📊 新旧组件对比

### 原组件（form-generator.tsx）
```
布局: 1:1:1（均等分布）
左栏: 生成器
中栏: 预览
右栏: 字段配置
```

### 新组件（form-generator-v2.tsx）
```
布局: 1:1.5:1（生成器居中）
左栏: 使用提示 + 当前状态
中栏: 生成器（居中突出）+ 预览
右栏: 快速示例 + 字段列表 + 字段配置
```

---

## 🎨 核心特点

### 1. 生成器居中突出
```tsx
<Card className="
  border-2 border-blue-500/30 
  bg-gradient-to-br from-blue-50/50 to-white 
  shadow-lg
">
  {/* 生成器内容 */}
</Card>
```

### 2. 左右对称
- **左栏**: 使用提示 + 当前状态
- **右栏**: 快速示例 + 字段列表 + 字段配置

### 3. 响应式设计
- **桌面**: 左中右三栏（1:1.5:1）
- **平板/手机**: 单列布局，生成器优先

---

## 🔧 Props 说明

```tsx
interface FormGeneratorV2Props {
  canCreate?: boolean;  // 是否可以创建表单（默认 true）
}
```

### canCreate
- `true`: 用户可以创建表单
- `false`: 用户已达配额上限，显示升级提示

---

## 📱 响应式断点

```tsx
// Tailwind CSS 断点
lg: 1024px  // 桌面版
md: 768px   // 平板版
sm: 640px   // 手机版

// 布局变化
>1024px: 左中右三栏
<1024px: 单列布局
```

---

## 🎯 使用场景

### 场景 1：替换原组件
```tsx
// 在 app/[locale]/(default)/(console)/forms/new/page.tsx

// 原来
import FormGenerator from "@/components/forms/form-generator";

// 改为
import FormGeneratorV2 from "@/components/forms/form-generator-v2";

// 使用
<FormGeneratorV2 canCreate={canCreate} />
```

### 场景 2：A/B 测试
```tsx
import FormGenerator from "@/components/forms/form-generator";
import FormGeneratorV2 from "@/components/forms/form-generator-v2";

export default function CreateFormPage() {
  const useV2 = Math.random() > 0.5; // 50% 用户使用新版本
  
  return (
    <div className="container mx-auto py-8">
      {useV2 ? (
        <FormGeneratorV2 canCreate={canCreate} />
      ) : (
        <FormGenerator canCreate={canCreate} />
      )}
    </div>
  );
}
```

### 场景 3：功能开关
```tsx
import FormGenerator from "@/components/forms/form-generator";
import FormGeneratorV2 from "@/components/forms/form-generator-v2";

export default function CreateFormPage() {
  const featureFlags = useFeatureFlags();
  const useV2 = featureFlags.newFormGenerator;
  
  return (
    <div className="container mx-auto py-8">
      {useV2 ? (
        <FormGeneratorV2 canCreate={canCreate} />
      ) : (
        <FormGenerator canCreate={canCreate} />
      )}
    </div>
  );
}
```

---

## ✅ 验证清单

### 功能验证
- [ ] 输入提示词，点击"生成表单"
- [ ] 查看生成的表单预览
- [ ] 编辑字段标签、占位符
- [ ] 切换必填/可选
- [ ] 移动字段顺序
- [ ] 删除字段
- [ ] 点击"保存"按钮
- [ ] 验证跳转到表单详情页

### 视觉验证
- [ ] 生成器卡片是否居中突出
- [ ] 左右卡片是否对称
- [ ] 蓝色边框和渐变背景是否显示
- [ ] 响应式设计是否正常

### 交互验证
- [ ] 点击快速示例是否填充提示词
- [ ] 点击字段列表是否切换预览
- [ ] 编辑字段是否实时更新预览
- [ ] 加载状态是否正常显示

---

## 🐛 常见问题

### Q1: 组件不显示？
**A**: 检查导入路径是否正确：
```tsx
import FormGeneratorV2 from "@/components/forms/form-generator-v2";
```

### Q2: 样式不正确？
**A**: 确保 Tailwind CSS 配置正确，并且包含了所有必要的类。

### Q3: TypeScript 报错？
**A**: 确保类型定义正确：
```tsx
import { FormTheme, GeneratedFormDraft } from "@/types/form";
```

### Q4: API 调用失败？
**A**: 检查 API 路由是否正确：
```tsx
POST /api/forms/generate
POST /api/forms
```

---

## 📊 性能建议

### 1. 使用 React.memo
```tsx
const FormGeneratorV2 = React.memo(function FormGeneratorV2({ canCreate }) {
  // ...
});
```

### 2. 使用 useMemo
```tsx
const activeField = useMemo(
  () => generated?.schema.fields[activePreviewIndex],
  [generated, activePreviewIndex]
);
```

### 3. 使用 useCallback
```tsx
const handleGenerate = useCallback(() => {
  // ...
}, [prompt, theme]);
```

---

## 🎉 总结

新组件已经准备就绪！

**核心优势**:
- ✅ 生成器居中突出
- ✅ 视觉焦点清晰
- ✅ 左右对称
- ✅ 响应式完整
- ✅ 代码质量高

**下一步**:
1. 在开发环境中测试
2. 进行 A/B 测试
3. 收集用户反馈
4. 决定是否替换原组件

---

**准备好了吗？开始使用新组件吧！** 🚀

