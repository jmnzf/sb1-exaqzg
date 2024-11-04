import React from 'react';
import { UserPlus } from 'lucide-react';

interface ProjectMembersProps {
  projectId: string;
  members: string[];
}

export default function ProjectMembers({ projectId, members }: ProjectMembersProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          <UserPlus className="h-5 w-5 mr-2" />
          Add Member
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {members.map((memberId) => (
            <li key={memberId} className="px-4 py-4 sm:px-6">
              <div className="flex items-center">
                <img
                  className="h-10 w-10 rounded-full"
                  src={`https://ui-avatars.com/api/?name=${memberId}&background=random`}
                  alt=""
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{memberId}</p>
                  <p className="text-sm text-gray-500">Member</p>
                </div>
              </div>
            </li>
          ))}
          {members.length === 0 && (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
              No members in this project
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}