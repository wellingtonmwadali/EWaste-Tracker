'use client';

import { TimelineEvent, DeviceStatus } from '@/lib/api';

interface TimelineProps {
  timeline: TimelineEvent[];
  currentStatus: DeviceStatus;
}

const statusConfig = {
  Disposed: {
    label: 'Disposed',
    icon: '🗑️',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500',
  },
  Collected: {
    label: 'Collected',
    icon: '📦',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500',
  },
  Recycled: {
    label: 'Recycled',
    icon: '♻️',
    color: 'text-primary-500',
    bgColor: 'bg-primary-500/10',
    borderColor: 'border-primary-500',
  },
};

export default function Timeline({ timeline, currentStatus }: TimelineProps) {
  const allStatuses: DeviceStatus[] = ['Disposed', 'Collected', 'Recycled'];
  
  const getEventForStatus = (status: DeviceStatus) => {
    return timeline.find((event) => event.status === status);
  };

  const isCompleted = (status: DeviceStatus) => {
    const statusIndex = allStatuses.indexOf(status);
    const currentIndex = allStatuses.indexOf(currentStatus);
    return statusIndex <= currentIndex;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Lifecycle Timeline</h3>
      
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-dark-700"></div>

        {/* Timeline items */}
        <div className="space-y-8">
          {allStatuses.map((status, index) => {
            const config = statusConfig[status];
            const event = getEventForStatus(status);
            const completed = isCompleted(status);
            const isCurrent = status === currentStatus;

            return (
              <div key={status} className="relative flex items-start">
                {/* Icon */}
                <div
                  className={`
                    relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2
                    ${completed ? config.borderColor : 'border-dark-700'}
                    ${completed ? config.bgColor : 'bg-dark-900'}
                    ${isCurrent ? 'ring-4 ring-primary-500/20 animate-pulse' : ''}
                  `}
                >
                  <span className="text-2xl">{config.icon}</span>
                </div>

                {/* Content */}
                <div className="ml-6 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4
                        className={`
                          text-lg font-semibold
                          ${completed ? config.color : 'text-dark-500'}
                        `}
                      >
                        {config.label}
                      </h4>
                      {event && (
                        <p className="text-sm text-dark-400 mt-1">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      )}
                    </div>

                    {completed && (
                      <div className="text-primary-500">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {event?.transactionHash && (
                    <a
                      href={`https://amoy.polygonscan.com/tx/${event.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-500 hover:text-primary-400 mt-2 inline-block"
                    >
                      View on PolygonScan →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
