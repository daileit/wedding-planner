import type { TranslationSchema } from "./en";

const vi: TranslationSchema = {
  // ==========================================
  // Common
  // ==========================================
  common: {
    appName: "WedBeLoving",
    tagline: "Người bạn đồng hành hoàn hảo cho đám cưới của bạn",
    loading: "Đang tải...",
    save: "Lưu",
    cancel: "Hủy",
    delete: "Xóa",
    edit: "Sửa",
    create: "Tạo",
    search: "Tìm kiếm",
    back: "Quay lại",
    next: "Tiếp theo",
    or: "Hoặc",
    and: "và",
    yes: "Có",
    no: "Không",
  },

  // ==========================================
  // Auth
  // ==========================================
  auth: {
    signIn: "Đăng nhập",
    signUp: "Đăng ký",
    signOut: "Đăng xuất",
    email: "Email",
    password: "Mật khẩu",
    confirmPassword: "Xác nhận mật khẩu",
    fullName: "Họ và tên",
    emailPlaceholder: "ban@example.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "Nguyễn Văn A",
    welcomeBack: "Chào mừng trở lại",
    signInDescription: "Đăng nhập để tiếp tục lên kế hoạch cho đám cưới hoàn hảo",
    createAccount: "Tạo tài khoản",
    signUpDescription: "Đăng ký để bắt đầu lên kế hoạch cho đám cưới hoàn hảo",
    orContinueWith: "Hoặc tiếp tục với",
    continueWithGoogle: "Tiếp tục với Google",
    signUpWithGoogle: "Đăng ký với Google",
    continueAsGuest: "Tiếp tục với tư cách khách",
    noAccount: "Chưa có tài khoản?",
    hasAccount: "Đã có tài khoản?",
    signUpHere: "Đăng ký tại đây",
    signUpLink: "Đăng ký",
    signInLink: "Đăng nhập",
    passwordMinLength: "Tối thiểu 8 ký tự",
    termsAgreement: "Bằng cách tiếp tục, bạn đồng ý với",
    termsOfService: "Điều khoản dịch vụ",
    privacyPolicy: "Chính sách bảo mật",
    // Errors
    errorServer: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
    errorCredentials: "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.",
    errorPasswordMismatch: "Mật khẩu không khớp",
    errorEmailExists: "Tài khoản với email này đã tồn tại",
    errorAuthTitle: "Lỗi xác thực",
    errorAuthDescription: "Đã xảy ra sự cố khi đăng nhập. Vui lòng thử lại.",
    tryAgain: "Thử lại",
    goHome: "Về trang chủ",
  },

  // ==========================================
  // Home / Landing
  // ==========================================
  home: {
    heroTag: "✨ Đám cưới mơ ước bắt đầu từ đây",
    heroTitle: "Lên kế hoạch đám cưới hoàn hảo với",
    heroDescription: "Nền tảng lên kế hoạch đám cưới tất cả trong một, giúp bạn quản lý ngân sách, sắp xếp công việc, theo dõi nhà cung cấp và tạo đám cưới mơ ước một cách dễ dàng.",
    startPlanning: "Bắt đầu miễn phí",
    learnMore: "Tìm hiểu thêm",
    featuresTitle: "Mọi thứ bạn cần để lên kế hoạch đám cưới",
    featuresDescription: "Các tính năng mạnh mẽ được thiết kế để việc lên kế hoạch đám cưới trở nên đơn giản và không căng thẳng.",
    ctaTitle: "Sẵn sàng bắt đầu?",
    ctaDescription: "Tham gia cùng hàng nghìn cặp đôi đã lên kế hoạch đám cưới hoàn hảo với WedBeLoving.",
    getStarted: "Bắt đầu ngay",
    footer: {
      rights: "Bảo lưu mọi quyền.",
      privacy: "Bảo mật",
      terms: "Điều khoản",
      contact: "Liên hệ",
    },
    features: {
      budget: {
        title: "Quản lý ngân sách",
        description: "Theo dõi chi phí đám cưới với quản lý ngân sách chi tiết và thông tin chi tiêu theo thời gian thực.",
      },
      tasks: {
        title: "Quản lý công việc",
        description: "Không bỏ lỡ hạn chót nào với danh sách công việc toàn diện và tính năng theo dõi tiến độ.",
      },
      vendors: {
        title: "Danh bạ nhà cung cấp",
        description: "Khám phá và đặt dịch vụ từ những nhà cung cấp đám cưới tốt nhất với ưu đãi và đánh giá độc quyền.",
      },
      timeline: {
        title: "Lên kế hoạch thời gian",
        description: "Lên kế hoạch mọi chi tiết từ lúc đính hôn đến ngày trọng đại với các công cụ trực quan.",
      },
    },
  },

  // ==========================================
  // Dashboard
  // ==========================================
  dashboard: {
    welcomeBack: "Chào mừng trở lại, {name}! 💍",
    overview: "Đây là tổng quan tiến độ lên kế hoạch đám cưới của bạn.",
    newPlan: "Kế hoạch mới",
    totalBudget: "Tổng ngân sách",
    spent: "Đã chi",
    completed: "Hoàn thành",
    tasksCompleted: "công việc đã hoàn thành",
    pending: "Đang chờ",
    tasksRemaining: "công việc còn lại",
    countdown: "Đếm ngược",
    daysUntil: "ngày đến đám cưới",
    recentActivity: "Hoạt động gần đây",
    recentActivityDescription: "Các cập nhật và thay đổi mới nhất.",
    noActivity: "Chưa có hoạt động. Bắt đầu bằng cách tạo kế hoạch mới!",
    quickActions: "Thao tác nhanh",
    quickActionsDescription: "Các tác vụ phổ biến giúp bạn lên kế hoạch.",
    createNewPlan: "Tạo kế hoạch mới",
    browseVendors: "Xem nhà cung cấp",
    manageBudget: "Quản lý ngân sách",
  },

  // ==========================================
  // Sidebar
  // ==========================================
  sidebar: {
    dashboard: "Bảng điều khiển",
    myPlans: "Kế hoạch",
    budget: "Ngân sách",
    timeline: "Thời gian",
    vendors: "Nhà cung cấp",
    settings: "Cài đặt",
    helpTitle: "Cần hỗ trợ lên kế hoạch?",
    helpDescription: "Thử trợ lý AI để tự động tạo kế hoạch đám cưới của bạn.",
    generateAI: "Tạo với AI",
  },

  // ==========================================
  // Header
  // ==========================================
  header: {
    searchPlaceholder: "Tìm kế hoạch, hạng mục, nhà cung cấp...",
    profileSettings: "Cài đặt hồ sơ",
    myPlans: "Kế hoạch của tôi",
  },

  // ==========================================
  // Footer tagline
  // ==========================================
  footerTagline: "Lên kế hoạch đám cưới mơ ước thật dễ dàng ✨",
};

export default vi;
