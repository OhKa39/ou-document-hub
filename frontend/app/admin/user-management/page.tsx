import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ServerFetch from '@/utils/ServerFetch';
import { UserState } from '@/store/UserStore';
import UserType from '@/types/UserType';
import Image from 'next/image';

const fetchUsers = async () => {
  const users = await ServerFetch('/api/v1/user/get-users').then((data) => data.json());
  return users;
};
const UserManagement = async () => {
  const { data } = await fetchUsers();
  // console.log(data);
  return (
    <div className="h-full bg-[#F5F6FA] px-8">
      <p className="py-6 text-3xl font-extrabold">User Management</p>
      <Table>
        <TableCaption>A list of users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Avatar</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Họ Tên</TableHead>
            <TableHead>Giới tính</TableHead>
            <TableHead>Ngày sinh</TableHead>
            {/* <TableHead>Is Enable</TableHead>
            <TableHead>Is Locked</TableHead> */}
            {/* <TableHead className="text-right">Hành động</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item: UserType) => (
            <TableRow key={item?.userId}>
              <TableCell className="text-center font-medium">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image src={item?.avatarLink!} alt="user avatar" className="absolute object-cover" fill />
                </div>
              </TableCell>
              <TableCell>{item?.userId}</TableCell>
              <TableCell>{item?.lastName + ' ' + item?.firstName}</TableCell>
              <TableCell>{item?.gender}</TableCell>
              <TableCell>{item?.dateOfBirth.toLocaleString('vi-VN')}</TableCell>
              {/* <TableCell>{item?.i}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserManagement;
