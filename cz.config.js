/** @type {import('cz-git').CommitizenGitOptions} */
export default {
  skipQuestions: ['body', 'breaking'],
  messages: {
    type: 'Chọn TYPE đang commit:',
    scope: 'SCOPE (optional):',
    customScope: 'Nhập SCOPE:',
    subject: 'MESSAGE - Viết mô tả ngắn gọn về sự thay đổi:\n',
    body: 'BODY - Cung cấp mô tả DÀI HƠN về thay đổi (optional). Sử dụng "|" để ngắt dòng mới:\n',
    breaking: 'List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
    footerPrefixesSelect: 'Select the ISSUES type of changeList by this change (optional):',
    customFooterPrefix: 'Prefix ISSUES: ',
    footer: 'Liệt kê ISSUES. VD: #31, #34: ',
    generatingByAI: 'Generating your AI commit subject...',
    generatedSelectByAI: 'Select suitable subject by AI generated:',
    confirmCommit: 'Bạn có chắc chắn muốn tiếp tục với commit ở trên không??'
  },
  types: [
    {
      value: 'feat',
      name: 'feat:        Thêm tính năng mới (feature)'
    },
    {
      value: 'refactor',
      name: 'refactor:    Sửa code nhưng không thêm tính năng mới'
    },
    {
      value: 'fix',
      name: 'fix:         Sửa lỗi (bug fix)'
    },
    {
      value: 'build',
      name: 'build:       Những thay đổi hướng đến quá trình build'
    },
    {
      value: 'docs',
      name: 'docs:        Chỉ thay đổi documentation'
    },
    {
      value: 'perf',
      name: 'perf:        Cải thiện hiệu năng'
    },
    {
      value: 'chore',
      name: 'chore:       Các thay đổi khác mà không sửa đổi src hoặc test'
    },
    {
      value: 'style',
      name: 'style:       Thay đổi code không ảnh hưởng đến logic (chỉ thay đổi style)'
    },
    {
      value: 'types',
      name: 'types:       Thay đổi type definitions (typescript)'
    },
    {
      value: 'test',
      name: 'test:        Thêm các test case bị thiếu hoặc sửa các test case hiện có'
    },
    {
      value: 'ci',
      name: 'ci:          Các thay đổi liên quan đến CI'
    },
    {
      value: 'revert',
      name: 'revert:      Revert lại một commit trước'
    }
  ],
  issuePrefixes: [
    {
      value: 'link',
      name: 'link:     Link to ISSUES'
    }
  ]
}
