export const quillToolbar = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
    [{ font: [] }], // 字体
    [{ size: [] }], // 字号
    [
      { color: [] }, // 文字颜色
      { background: [] } // 背景色
    ],
    [
      'bold', // 加粗
      'italic', // 斜体
      'underline', // 下划线
      'strike', // 删除线
      'blockquote', // 引用
      'code-block' // 代码块
    ],
    [{ script: 'sub' }, { script: 'super' }], // superscript（x2）/subscript
    [{ align: [] }], // 对齐方式
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [
      'link', // 链接
      'image', // 图片
      'video' // 视频
      // "formula", // 数学函数
    ],
    [
      { list: 'ordered' }, // 有序列表
      { list: 'bullet' }, // 无序列表
      { list: 'check' } // 选中列表
    ],
    ['clean'] // 清除按钮
  ]
}
