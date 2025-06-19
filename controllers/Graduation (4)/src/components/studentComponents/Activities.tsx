import { Activity, ArrowLeft, BookOpen, CheckCircle, Clock, Star } from "lucide-react"

const Activities = ({handleSectionChange,activities}) => {
  return (
        <div className="space-y-6">
      <div className="flex items-center">
        <button
        aria-label="Back"
          onClick={() => handleSectionChange("dashboard")}
          className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Activity className="h-6 w-6 mr-2 text-purple-600" />
          Recent Activities
        </h2>
      </div>

      <div className="space-y-4">
        {activities.map((activity,index) => (
          <div
            key={activity.id}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    Number.isInteger((index-0)/4)
                      ? "bg-blue-100"
                      : Number.isInteger((index-1)/5)
                      ? "bg-red-100"
                      : Number.isInteger((index-2)/6)
                      ? "bg-yellow-100"
                      : Number.isInteger((index-3)/7)
                      ? "bg-green-100"
                      : "bg-gray-100"
                  }`}
                >
                  {Number.isInteger((index-0)/4) && (
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  )}
                  {Number.isInteger((index-1)/5) && (
                    <BookOpen className="h-5 w-5 text-red-600" />
                  )}
                  {Number.isInteger((index-2)/6) && (
                    <Clock className="h-5 w-5 text-yellow-600" />
                  )}
                  {Number.isInteger((index-3)/7) && (
                    <Star className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {/* {activity.title} */}
                    {activity.description}
                  </h3>
                  <p className="text-blue-600 text-sm font-medium">
                    {/* {activity.course} */}
                    {activity.type}
                  </p>
                </div>
              </div>
              <span className="text-gray-500 text-sm">{new Date(activity.date).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Activities