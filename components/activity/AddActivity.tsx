"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { usePathname, useRouter } from "next/navigation";
import { IActivity } from "@/lib/models/activity";
import {
  archiveActivity,
  updateActivity,
} from "@/lib/actions/activity.action";
import {
  archiveToast,
  successToast,
} from "@/lib/actions/toast.actions";
import { IconTrash } from "@tabler/icons-react";
import BackButton from "../shared/BackButton";
import { Button, Select, TextInput } from "@mantine/core";
import Map from "../shared/Map";
import { option } from "@/lib/models/select-options";
import ReloadMapPlaceholder from "../shared/ReloadMapPlaceholder";
import { IExpense } from "@/lib/models/expense";

export default function AddActivity(props: {
  activity: IActivity;
  longLat: number[];
  expenseList: IExpense[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [changesMade, setChangesMade] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [address, setAddress] = useState<string>(props.activity.address);

  useEffect(() => {
    console.log(address);
  }, [address]);

  const expenseOptions: option[] = props.expenseList.map((user: IExpense) => ({
    value: user.expense,
    label: user.expense,
  }));

  interface formActivity {
    _id: string;
    activityName: string;
    address: string;
    archive: boolean;
    userGroupID: string;
    expense: string;
  }

  const form = useForm({
    initialValues: {
      _id: props.activity._id ? props.activity._id : "",
      activityName: props.activity.activityName
        ? props.activity.activityName
        : "",
      address: props.activity.address ? props.activity.address : "",
      archive: props.activity.archive ? props.activity.archive : false,
      userGroupID: props.activity.userGroupID ? props.activity.userGroupID : "",
      expense: props.activity.expense ? props.activity.expense : "",
    },
  });

  const onSubmit = async (values: formActivity) => {
    const payload: IActivity = {
      ...props.activity,
      activityName: values.activityName,
      address: values.address,
      expense: values.expense
    };

    const activity = await updateActivity(payload);
    if (pathname.includes("/activity/")) {
      successToast(activity.activityName);
      setChangesMade(true);

      if (payload.address !== "") {
        setAddress(payload.address);
      }
    } else {
      router.push(`/activity/${activity._id}`);
    }
  };

  const handleArchive = async () => {
    await archiveActivity(props.activity._id);
    archiveToast(props.activity.activityName);
    setTimeout(() => {
      const url = `${window.location.protocol}//${window.location.host}`;
      window.location.href = `${url}/activitys`;
    }, 1000);
  };

  const pullData = (data: boolean) => {
    setOpen(data);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <BackButton
          record={props.activity}
          changesMade={changesMade}
          page="activities"
        />
        <Button
          className={`bg-danger text-light-1 ${
            props.activity._id === "" ? "hidden" : ""
          }`}
          onClick={handleArchive}
          aria-label="archive"
        >
          <IconTrash className="dark:text-light-1 text-dark-1" />
        </Button>
      </div>
      <form
        onSubmit={form.onSubmit((values) => onSubmit(values))}
        className={`flex flex-col justify-start gap-10 pt-4 ${
          props.activity._id === "" ? "px-6" : ""
        }`}
      >
        <TextInput
          label="Name"
          radius="md"
          placeholder="The good yum yum place"
          className="text-dark-2 dark:text-light-2"
          size="md"
          {...form.getInputProps("activityName")}
        />
        <Select
          radius="md"
          size="md"
          clearable
          transitionProps={{ transition: "pop-bottom-left", duration: 200 }}
          label="How much?!"
          placeholder="Pick one"
          data={expenseOptions}
          {...form.getInputProps("expense")}
        />
        <TextInput
          label="Address"
          radius="md"
          placeholder="Where it at?"
          className="text-dark-2 dark:text-light-2"
          size="md"
          {...form.getInputProps("address")}
        />
        {props.longLat[0] !== undefined && props.longLat[1] !== undefined && (
          <Map longLat={props.longLat} title={props.activity.activityName} />
        )}
        {address !== undefined &&
          address !== "" &&
          props.longLat[0] === undefined &&
          props.longLat[1] === undefined && <ReloadMapPlaceholder />}
        <Button
          radius="md"
          className="bg-primary-500 hover:bg-primary-hover text-light-1"
          type="submit"
        >
          {props.activity._id === "" ? "Add" : "Update"} Activity
        </Button>
      </form>
    </div>
  );
}
