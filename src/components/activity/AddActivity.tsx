'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from '@mantine/form'
import { usePathname, useRouter } from 'next/navigation'
import { archiveActivity, updateActivity } from '@/lib/actions/activity.action'
import { archiveToast, successToast } from '@/lib/actions/toast.actions'
import { IconTrash } from '@tabler/icons-react'
import BackButton from '../shared/BackButton'
import { Select } from '@mantine/core'
import Map from '../shared/Map'
import ReloadMapPlaceholder from '../shared/ReloadMapPlaceholder'
import { Activity, Expense } from '@/server/db/schema'
import { option } from '@/lib/models/select-options'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AddActivity(props: {
  activity: Activity
  longLat: number[]
  expenseList: Expense[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [changesMade, setChangesMade] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [address, setAddress] = useState<string>(props.activity.address)

  useEffect(() => {
    console.log(address)
  }, [address])

  const expenseOptions: option[] = props.expenseList.map((user: Expense) => ({
    value: user.id,
    label: user.expense
  }))

  interface formActivity {
    id: string
    activityName: string
    address: string
    archive: boolean
    userGroupId: string
    expenseId: string
  }

  const form = useForm({
    initialValues: {
      id: props.activity.id ? props.activity.id : '',
      activityName: props.activity.activityName
        ? props.activity.activityName
        : '',
      address: props.activity.address ? props.activity.address : '',
      archive: props.activity.archive ? props.activity.archive : false,
      userGroupId: props.activity.userGroupId ? props.activity.userGroupId : '',
      expenseId: props.activity.expenseId ? props.activity.expenseId : ''
    }
  })

  const onSubmit = async (values: formActivity) => {
    const payload: Activity = {
      ...props.activity,
      activityName: values.activityName,
      address: values.address,
      expenseId: values.expenseId
    }

    const [activity] = await updateActivity(payload)
    if (pathname.includes('/activity/')) {
      successToast(activity.activityName)
      setChangesMade(true)

      if (payload.address !== '') {
        setAddress(payload.address)
      }
    } else {
      router.push(`/activity/${activity.id}`)
    }
  }

  const handleArchive = async () => {
    await archiveActivity(props.activity.id)
    archiveToast(props.activity.activityName)
    setTimeout(() => {
      const url = `${window.location.protocol}//${window.location.host}`
      window.location.href = `${url}/activitys`
    }, 1000)
  }

  const pullData = (data: boolean) => {
    setOpen(data)
  }

  return (
    <div>
      <div className='flex items-center justify-between'>
        <BackButton
          record={props.activity}
          changesMade={changesMade}
          page='activities'
        />
        <Button
          className={`bg-destructive ${
            props.activity.id === '' ? 'hidden' : ''
          }`}
          onClick={handleArchive}
          aria-label='archive'
        >
          <IconTrash />
        </Button>
      </div>
      <form
        onSubmit={form.onSubmit((values) => onSubmit(values))}
        className={`flex flex-col justify-start gap-10 pt-4 ${
          props.activity.id === '' ? 'px-6' : ''
        }`}
      >
        <Label htmlFor='activityName'>Name</Label>
        <Input
          placeholder='The good yum yum place'
          {...form.getInputProps('activityName')}
        />
        <Select
          radius='md'
          size='md'
          clearable
          transitionProps={{ transition: 'pop-bottom-left', duration: 200 }}
          label='How much?!'
          placeholder='Pick one'
          data={expenseOptions}
          {...form.getInputProps('expenseId')}
        />
        <Label htmlFor='address'>Address</Label>
        <Input placeholder='Where it at?' {...form.getInputProps('address')} />
        {props.longLat[0] !== undefined && props.longLat[1] !== undefined && (
          <Map longLat={props.longLat} title={props.activity.activityName} />
        )}
        {address !== undefined &&
          address !== '' &&
          props.longLat[0] === undefined &&
          props.longLat[1] === undefined && <ReloadMapPlaceholder />}
        <Button type='submit'>
          {props.activity.id === '' ? 'Add' : 'Update'} Activity
        </Button>
      </form>
    </div>
  )
}
