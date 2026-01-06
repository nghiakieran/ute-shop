import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Code,
  Database,
  Shield,
  CreditCard,
  MessageSquare,
  Package,
  Users,
  Star,
  Zap,
  Github,
  Mail,
  Heart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout } from '@/layouts';

const AboutPage = () => {
  const technologies = [
    {
      name: 'React + TypeScript',
      description: 'Frontend framework hiện đại với type safety',
      icon: Code,
      color: 'text-blue-500',
    },
    {
      name: 'NestJS',
      description: 'Backend framework mạnh mẽ, scalable',
      icon: Database,
      color: 'text-red-500',
    },
    {
      name: 'Redux Toolkit',
      description: 'State management hiệu quả',
      icon: Zap,
      color: 'text-purple-500',
    },
    {
      name: 'TailwindCSS',
      description: 'Utility-first CSS framework',
      icon: Code,
      color: 'text-cyan-500',
    },
  ];

  const features = [
    {
      title: 'Quản lý sản phẩm',
      description: 'Hệ thống quản lý sản phẩm đầy đủ với danh mục, thương hiệu, và tìm kiếm thông minh',
      icon: Package,
      color: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Giỏ hàng & Thanh toán',
      description: 'Tích hợp VNPay và thanh toán COD, quản lý đơn hàng chi tiết',
      icon: CreditCard,
      color: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Đánh giá & Nhận xét',
      description: 'Hệ thống đánh giá sản phẩm với rating và comment đầy đủ',
      icon: Star,
      color: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
    {
      title: 'Chat trực tuyến',
      description: 'Tích hợp WebSocket cho chat real-time giữa khách hàng và admin',
      icon: MessageSquare,
      color: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Quản trị viên',
      description: 'Dashboard quản lý đầy đủ cho admin với phân quyền và báo cáo',
      icon: Shield,
      color: 'bg-red-100 dark:bg-red-900/20',
    },
    {
      title: 'Yêu thích & Theo dõi',
      description: 'Lưu sản phẩm yêu thích và theo dõi lịch sử xem sản phẩm',
      icon: Heart,
      color: 'bg-pink-100 dark:bg-pink-900/20',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6"
              >
                <ShoppingBag className="w-10 h-10 text-primary" />
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                UTE Shop
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Hệ thống thương mại điện tử hiện đại, được xây dựng với công nghệ tiên tiến
              </p>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Dự án được phát triển như một phần của môn học Công nghệ phần mềm,
                mang đến trải nghiệm mua sắm trực tuyến hoàn chỉnh với đầy đủ tính năng
                từ quản lý sản phẩm, đơn hàng đến thanh toán và tương tác với khách hàng.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Công nghệ sử dụng</h2>
              <p className="text-muted-foreground text-lg">
                Xây dựng với các công nghệ hiện đại và best practices
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {technologies.map((tech, index) => {
                const Icon = tech.icon;
                return (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg ${tech.color} bg-opacity-10 flex items-center justify-center mb-4`}>
                          <Icon className={`w-6 h-6 ${tech.color}`} />
                        </div>
                        <CardTitle className="text-xl">{tech.name}</CardTitle>
                        <CardDescription>{tech.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Tính năng nổi bật</h2>
              <p className="text-muted-foreground text-lg">
                Đầy đủ các tính năng cần thiết cho một hệ thống thương mại điện tử
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                        <CardDescription className="text-base">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-4xl font-bold mb-4">Liên hệ & Đóng góp</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Dự án mã nguồn mở, chào đón mọi đóng góp từ cộng đồng
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.a
                  href="https://github.com/nghiakieran/ute-shop"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub Repository</span>
                </motion.a>
                <motion.a
                  href="mailto:support@uteshop.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>Email Support</span>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer Note */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-muted-foreground"
            >
              Made with <Heart className="inline w-4 h-4 text-red-500" /> by UTE Shop Team
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-sm text-muted-foreground mt-2"
            >
              © 2026 UTE Shop. Dự án học tập - Công nghệ phần mềm
            </motion.p>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default AboutPage;

