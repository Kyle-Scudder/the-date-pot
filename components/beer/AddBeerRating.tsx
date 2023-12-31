"use client";

import { IBeer } from "@/lib/models/beer";
import { IBeerRating } from "@/lib/models/beer-rating";
import { getNewBeerID, updateBeerRating } from "@/lib/actions/beer.action";
import { IUser } from "@/lib/models/user";
import { Button, Rating, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { option } from "@/lib/models/select-options";

export default function AddBeerRating(props: {
  beer: IBeer;
  beerRating: IBeerRating;
  users: IUser[];
  addRating: (data: IBeerRating) => void;
  func: (data: boolean) => void;
}) {
  const options: option[] = props.users.map((user: IUser) => ({
    value: user._id,
    label: user.name,
  }));

  interface formRating {
    _id: string;
    beerID: string;
    wankyness: number;
    taste: number;
    userID: string;
    username: string;
  }

  const form = useForm({
    initialValues: {
      _id: props.beerRating._id ? props.beerRating._id : "",
      beerID: props.beer._id ? props.beer._id : "",
      wankyness: props.beerRating.wankyness
        ? props.beerRating.wankyness
        : 0,
      taste: props.beerRating.taste ? props.beerRating.taste : 0,
      userID: props.beerRating.userID ? props.beerRating.userID : "",
      username: props.beerRating.username ? props.beerRating.username : "",
    },
  });

  const onSubmit = async (values: formRating) => {
    const username = props.users.filter((user) => user._id === values.userID)[0].name;
    const payload: IBeerRating = {
      _id: values._id,
      beerID: props.beer._id,
      wankyness: values.wankyness,
      taste: values.taste,
      userID: values.userID,
      username: username
    };
    if (payload.beerID !== '') {
      const rating = await updateBeerRating(payload);
      const ratingWithUsername: IBeerRating = {
        ...rating,
        username: username
      };
      props.addRating(ratingWithUsername);
    } else {
      props.addRating(payload);
    }
    props.func(false);
  };

  return (
    <form
      onSubmit={form.onSubmit((values) => onSubmit(values))}
      className={`flex flex-col justify-start gap-10 pt-4 ${
        props.beer._id === "" ? "px-6" : ""
      }`}
    >
      <Select
        radius="md"
        size="md"
        clearable
        transitionProps={{ transition: "pop-bottom-left", duration: 200 }}
        label="Who?"
        placeholder="Pick one"
        data={options}
        {...form.getInputProps("userID")}
      />
      <div className="text-base flex items-center pt-2">
        <span className="w-32 text-center inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-black text-gray-700 mr-2">
          Taste
        </span>
        <Rating
          name="taste"
          fractions={2}
          size="xl"
          {...form.getInputProps("taste")}
        />
      </div>
      <div className="text-base flex items-center pt-5">
        <span className="w-32 text-center inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-black text-gray-700 mr-2">
          Wankyness
        </span>
        <Rating
          name="wankyness"
          fractions={2}
          size="xl"
          {...form.getInputProps("wankyness")}
        />
      </div>
      <Button
        radius="md"
        className="bg-primary-500 hover:bg-primary-hover text-light-1"
        type="submit"
      >
        {props.beerRating._id === "" ? "Add" : "Update"} Rating
      </Button>
    </form>
  );
}
