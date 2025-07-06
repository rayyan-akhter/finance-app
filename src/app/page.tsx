'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  PiggyBank, 
  BarChart3, 
  Settings, 
  LogOut, 
  User,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  Plus,
  MoreHorizontal,
  Building2,
  ShoppingCart,
  Car,
  GraduationCap,
  Home as HomeIcon,
  Calculator,
  CheckCircle,
  Star,
  Users,
  Zap,
  Shield,
  Clock
} from 'lucide-react'
import { auth, formatCurrency, formatPercentage } from '@/lib/utils'
import { config, isDemoMode, getDemoData } from '@/lib/config'
import DemoModeToggle from '@/components/DemoModeToggle'
import DemoInstructions from '@/components/DemoInstructions'
import ThemeToggle from '@/components/ThemeToggle'
import AnimatedBackground from '@/components/AnimatedBackground'
import ShimmerEffect from '@/components/ShimmerEffect'
import { useTheme } from '@/lib/theme'

export default function Home() {
  const router = useRouter()
  const { isDark } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [showBalance, setShowBalance] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    if (!auth.isAuthenticated()) {
      router.push('/signin')
      return
    }

    const userData = auth.getUser()
    setUser(userData)
    setIsLoading(false)
  }, [router])

  // Loan types data
  const loanTypes = [
    {
      id: 1,
      name: 'Business Loan',
      icon: Building2,
      description: 'Grow your business with flexible financing',
      amount: '₹50L - ₹2Cr',
      interest: '12-18%',
      tenure: '12-60 months',
      features: ['Quick approval', 'No collateral', 'Flexible repayment'],
      color: 'blue',
      popular: true
    },
    {
      id: 2,
      name: 'Working Capital',
      icon: Zap,
      description: 'Bridge cash flow gaps and manage operations',
      amount: '₹10L - ₹1Cr',
      interest: '14-20%',
      tenure: '6-24 months',
      features: ['Instant disbursal', 'Minimal documentation', 'Revolving credit'],
      color: 'green'
    },
    {
      id: 3,
      name: 'Equipment Finance',
      icon: ShoppingCart,
      description: 'Finance machinery and equipment purchases',
      amount: '₹5L - ₹50L',
      interest: '13-19%',
      tenure: '12-48 months',
      features: ['Asset-backed', 'Tax benefits', 'Low down payment'],
      color: 'purple'
    },
    {
      id: 4,
      name: 'Vehicle Loan',
      icon: Car,
      description: 'Finance commercial vehicles and cars',
      amount: '₹2L - ₹25L',
      interest: '11-16%',
      tenure: '12-60 months',
      features: ['Competitive rates', 'Quick processing', 'Insurance included'],
      color: 'orange'
    },
    {
      id: 5,
      name: 'Education Loan',
      icon: GraduationCap,
      description: 'Invest in education and skill development',
      amount: '₹1L - ₹20L',
      interest: '10-15%',
      tenure: '12-84 months',
      features: ['Study abroad', 'Course coverage', 'Grace period'],
      color: 'indigo'
    },
    {
      id: 6,
      name: 'Property Loan',
      icon: HomeIcon,
      description: 'Finance commercial property and real estate',
      amount: '₹25L - ₹5Cr',
      interest: '9-14%',
      tenure: '60-240 months',
      features: ['Long tenure', 'Low interest', 'Property ownership'],
      color: 'red'
    }
  ]

  // Stats data
  const stats = [
    { label: 'Loans Disbursed', value: '₹500Cr+', icon: DollarSign, color: 'green' },
    { label: 'Happy Customers', value: '10,000+', icon: Users, color: 'blue' },
    { label: 'Approval Rate', value: '95%', icon: CheckCircle, color: 'purple' },
    { label: 'Processing Time', value: '24-48 hrs', icon: Clock, color: 'orange' }
  ]

  const handleLogout = () => {
    auth.logout()
    router.push('/signin')
  }

  const handleApplyLoan = (loanType: any) => {
    // In demo mode, show alert. In production, redirect to application form
    if (isDemoMode()) {
      alert(`Demo: You would be redirected to apply for ${loanType.name}`)
    } else {
      // Redirect to loan application form
      router.push(`/apply-loan/${loanType.id}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative">
      <AnimatedBackground />
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center animate-pulse-slow">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{config.appName}</h1>
              {isDemoMode() && (
                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full transition-colors duration-300">
                  DEMO
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle />
              <DemoModeToggle />
              <div className="hidden sm:flex items-center space-x-2">
                <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-300">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-300" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">{user?.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Demo Instructions */}
        {isDemoMode() && <DemoInstructions />}

        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 transition-colors duration-300">
            Smart Business Financing
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto transition-colors duration-300 px-2">
            Get the capital you need to grow your business. Fast approval, competitive rates, and flexible repayment options.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 px-2">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-scale-in hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`inline-flex p-2 sm:p-3 rounded-lg mb-3 sm:mb-4 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 animate-float`}>
                  <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-300">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Loan Types */}
        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-6 sm:mb-8 px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 transition-colors duration-300">
              Choose Your Loan Type
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300 px-2">
              We offer a wide range of financing solutions to meet your business needs. Select the loan that best fits your requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4">
            {loanTypes.map((loan, index) => (
              <ShimmerEffect key={loan.id} className="rounded-xl">
                <div 
                  className={`bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slide-up group cursor-pointer`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                {loan.popular && (
                  <div className="flex items-center justify-center mb-3 sm:mb-4">
                    <span className="px-2 sm:px-3 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full font-medium transition-colors duration-300 animate-pulse-slow">
                      <Star className="h-3 w-3 inline mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-4 sm:mb-6">
                  <div className={`inline-flex p-3 sm:p-4 rounded-xl mb-3 sm:mb-4 bg-${loan.color}-100 dark:bg-${loan.color}-900/20 group-hover:scale-110 transition-transform duration-300`}>
                    <loan.icon className={`h-6 w-6 sm:h-8 sm:w-8 text-${loan.color}-600 dark:text-${loan.color}-400`} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{loan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 transition-colors duration-300">{loan.description}</p>
                  
                                     <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm mb-4 sm:mb-6">
                     <div>
                       <div className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">Amount</div>
                       <div className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{loan.amount}</div>
                     </div>
                     <div>
                       <div className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">Interest</div>
                       <div className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{loan.interest}</div>
                     </div>
                     <div>
                       <div className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">Tenure</div>
                       <div className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{loan.tenure}</div>
                     </div>
                   </div>
                </div>

                                 <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                   {loan.features.map((feature, idx) => (
                     <div key={idx} className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                       <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                       {feature}
                     </div>
                   ))}
                 </div>

                                 <button
                   onClick={() => handleApplyLoan(loan)}
                   className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-sm sm:text-base font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 animate-gradient"
                 >
                   Apply Now
                 </button>
                </div>
              </ShimmerEffect>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-200 dark:border-gray-700 mb-8 sm:mb-12 transition-colors duration-300 mx-4">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 transition-colors duration-300">
              Why Choose {config.appName}?
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300 px-2">
              We make business financing simple, fast, and transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center group">
              <div className="inline-flex p-3 sm:p-4 rounded-xl mb-3 sm:mb-4 bg-blue-100 dark:bg-blue-900/20 group-hover:scale-110 transition-transform duration-300 animate-float">
                <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Quick & Easy</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">Get approved in 24-48 hours with minimal documentation and hassle-free process.</p>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex p-3 sm:p-4 rounded-xl mb-3 sm:mb-4 bg-green-100 dark:bg-green-900/20 group-hover:scale-110 transition-transform duration-300 animate-float" style={{ animationDelay: '0.5s' }}>
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Secure & Transparent</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">Your data is protected with bank-level security. No hidden charges or surprises.</p>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex p-3 sm:p-4 rounded-xl mb-3 sm:mb-4 bg-purple-100 dark:bg-purple-900/20 group-hover:scale-110 transition-transform duration-300 animate-float" style={{ animationDelay: '1s' }}>
                <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Competitive Rates</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">Get the best interest rates starting from 9% with flexible repayment options.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white text-center animate-gradient mx-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-4 sm:mb-6 opacity-90">
            Join thousands of businesses that trust us for their financing needs.
          </p>
          <button
            onClick={() => handleApplyLoan(loanTypes[0])}
            className="bg-white text-blue-600 py-2 sm:py-3 px-6 sm:px-8 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 animate-pulse-slow"
          >
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  )
}
