import React, {useState, useEffect} from 'react'
import Spinner from '../../components/Spinner'
import progressiveService from '../../services/progressService.js'
import toast from 'react-hot-toast'
import {FileText, BookOpen, BrainCircuit, TrendingUp, Clock} from 'lucide-react'
const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const[loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try{
        const data = await progressiveService.getDashboard()
        setDashboardData(data.data)
      }catch(error){
        toast.error('Fauked ti fetch dashboard data')
        console.error(error)
      }finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  if (loading) {
  return <Spinner />;
}

if (!dashboardData || !dashboardData.overview) {
 return (
    <div className="flex items-center justify-center min-h-[400px] w-full animate-in fade-in duration-500">
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none max-w-sm text-center">
        <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl mb-6 shadow-inner">
          <TrendingUp className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
          No data found
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          We couldn't find any dashboard data available right now.
        </p>
      </div>
    </div>
  );
}

const stats = [
  {
    label: "Total Documents",
    value: dashboardData.overview.totalDocuments,
    icon: FileText,
    gradient: "from-blue-400 to-cyan-500",
    shadowColor: "shadow-blue-400",
  }, {
    label: "Total Flashcards",
    value: dashboardData.overview.totalFlashcards,
    icon: BookOpen,
    gradient: "from-purple-400 to-pink-500",
    shadowColor: "shadow-blue-400",
  },{
    label: "Total Quizzes",
    value: dashboardData.overview.totalQuizzes,
    icon: BrainCircuit,
    gradient: "from-emerald-400 to-teal-500",
    shadowColor: "shadow-blue-400",
  },
  
];















}

export default DashboardPage