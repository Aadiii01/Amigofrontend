import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "@nextui-org/input";
import { Avatar } from "@nextui-org/avatar";
import { Select, SelectItem } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";
import "../../Styles/Profile.css";
import { Gender, Country, myInterests } from "@/Utils/Data.jsx";
import { GalleryIcon } from "@/Utils/Icon";
import { Image } from "@nextui-org/image";
import { ScrollShadow } from "@nextui-org/react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/Components/ui/toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "@nextui-org/react";
import {
  checkUser,
  updateUserProfile,
  uploadAvatar,
  uploadPhotos,
} from "@/Store/userSlice";

const UpdateProfileSchema = Yup.object().shape({
  fullName: Yup.string().min(2, "Too Short!").max(15, "Too Long!"),
  gender: Yup.string(),
  age: Yup.number().min(18, "Greater then 18"),
  interest: Yup.array().min(3, "You must select at least 3 interests"),
  about: Yup.string()
    .min(10, "About should be at least 10 characters long")
    .max(170, "About is too long"),
  address: Yup.object({
    state: Yup.string()
      .min(2, "State name is too short")
      .max(50, "State name is too long"),

    city: Yup.string()
      .min(2, "City name is too short")
      .max(50, "City name is too long"),

    pincode: Yup.string().matches(
      /^[1-9][0-9]{5}$/,
      "Pincode must be a 6-digit number"
    ),
  }),
});

const UpateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { user, isLoading, error } = useSelector((state) => state.userData);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialValues = {
    fullName: user?.data?.fullName || user?.data?.user?.fullName || "Your Name",
    gender: user?.data?.gender || user?.data?.user?.gender || "Gender",
    age: user?.data?.age || user?.data?.user?.age || "20",
    interest: user?.data?.interest || user?.data?.user?.interest || [],
    about: user?.data?.about || user?.data?.user?.about || "",
    address: {
      state: user?.data?.address?.state || user?.data?.user?.address?.state || "",
      city: user?.data?.address?.city || user?.data?.user?.address?.city || "",
      pincode: user?.data?.address?.pincode || user?.data?.user?.address?.pincode || "",
    },
  };

  const username =
    user?.data?.userName || user?.data?.user?.userName || "User Name";
  const avatarUrl = user?.data?.avatar || user?.data?.user?.avatar;
  const photoUrl = user?.data?.photos || user?.data?.user?.photos;
  const fullName = user?.data?.fullName || "Your Name";
  const gender = user?.data?.gender || "Gender";
  const age = user?.data?.age || "20";
  const interest = user?.data?.interest || [];
  const about = user?.data?.about || "";
  const state = user?.data?.address?.state;
  const city = user?.data?.address?.city;
  const pincode = user?.data?.address?.pincode;

  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // useEffect(() => {
  //   dispatch(checkUser());
  // }, [dispatch]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    setIsUploading(true);
    if (file) {
      try {
        await dispatch(uploadAvatar(file));
        setIsUploading(false);
        toast({
          variant: "outline",
          description: "Avatar Update Successfully",
          className: "text-white font-[NetflixL] bg-[#00c06a]",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Due to server issue avatar is not update",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
          className: "text-white font-[NetflixL]",
        });
      }
    }
  };

  const triggerFileInput = () => {
    document.getElementById("uploadFile1").click();
  };

  const handlePictureUpload = async (event) => {
    const photofiles = event.target.files[0];
    setIsUploadingPhoto(true);
    if (photofiles) {
      try {
        await dispatch(uploadPhotos(photofiles));
        setIsUploadingPhoto(false);
        toast({
          variant: "outline",
          description: "Photo Update Successfully",
          className: "text-white font-[NetflixL] bg-[#00c06a]",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Due to server issue Photo is not update",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
          className: "text-white font-[NetflixL]",
        });
      }
    }
  };

  const triggerPictureInput = () => {
    document.getElementById("uploadPicture").click();
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const result = await dispatch(updateUserProfile(values)).unwrap();
      if (result?.success) {
        resetForm();
        toast({
          variant: "outline",
          title: "Profile",
          description: "Profile Update Successfully",
          className: "text-white font-[NetflixL] bg-[#00c06a]",
        });
        navigate("/home/profile");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Profile",
        description: "Due to server issue Profile is not Update",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
        className: "text-white font-[NetflixL]",
      });
      onOpen();
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading && !isUploading && !isUploadingPhoto) {
    return <div></div>; 
  }

  return (
    <ScrollShadow
      className="sm:overflow-y-auto overflow-hidden"
      hideScrollBar
      size={50}
    >
      <div className="flex items-start sm:items-center justify-center mt-3 ">
        <div className="sm:rounded-lg sm:bg-card sm:text-card-foreground w-full sm:w-[95%] lg:w-[80%] sm:max-h-[530px]">
          <CardHeader>
            <CardTitle className="text-xl font-[NetflixB]">
              Update your Profile
            </CardTitle>
            <CardDescription className="font-[NetflixL]">
              Enter your information to update
            </CardDescription>
          </CardHeader>

          <Formik
            initialValues={initialValues}
            validationSchema={UpdateProfileSchema}
            onSubmit={handleSubmit}
          >
            {({
              isSubmitting,
              handleChange,
              handleBlur,
              values,
              errors,
              touched,
              setFieldValue,
            }) => (
              <Form>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols">
                      <div className="grid gap-2 m-auto">
                        <Avatar
                          isBordered
                          color="danger"
                          src={avatarUrl}
                          className="w-20 h-20 text-large"
                        />
                      </div>
                      <div className="grid gap-2 mt-4 font-[NetflixR]">
                        <Button
                          className="bg-[#e50914] text-white"
                          endContent={<GalleryIcon />}
                          onClick={triggerFileInput}
                        >
                          <input
                            type="file"
                            id="uploadFile1"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                          Update Profile Pic
                        </Button>
                      </div>
                    </div>

                    {isUploading && <Spinner size="lg" color="danger" />}

                    <div className="grid grid-cols-2 gap-4 font-[NetflixR]">
                      <div className="grid gap-2">
                        <Input
                          type="text"
                          label="Full Name"
                          placeholder="Full Name"
                          labelPlacement="outside"
                          variant="bordered"
                          name="fullName"
                          value={values.fullName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.fullName && errors.fullName}
                          color={
                            touched.fullName && errors.fullName
                              ? "danger"
                              : "success"
                          }
                          errorMessage={
                            touched.fullName && errors.fullName
                              ? errors.fullName
                              : ""
                          }
                          classNames={{
                            label: "text-[#0a0a0a]",
                          }}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Input
                          type="text"
                          label="Username"
                          placeholder="aadii"
                          labelPlacement="outside"
                          variant="bordered"
                          name="username"
                          value={username}
                          isDisabled
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2 font-[NetflixR]">
                        <Input
                          type="number"
                          label="Age"
                          labelPlacement="outside"
                          placeholder="Age"
                          variant="bordered"
                          name="age"
                          value={values.age}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.age && errors.age}
                          color={
                            touched.age && errors.age ? "danger" : "success"
                          }
                          errorMessage={
                            touched.age && errors.age ? errors.age : ""
                          }
                          classNames={{
                            label: "text-[#0a0a0a]",
                          }}
                        />
                      </div>
                      <div className="grid gap-1 font-[NetflixR]">
                        <label className="text-[14px]" htmlFor="gender">
                          Gender
                        </label>
                        <Field
                          as="select"
                          name="gender"
                          value={values.gender}
                          onChange={handleChange}
                          className="h-[38px] rounded-[10px] border-2 text-sm pl-2 font-[NetflixR]"
                        >
                          <option value="" label="Gender" disabled hidden />
                          {Gender.map((gender) => (
                            <option key={gender.value} value={gender.value}>
                              {gender.label}
                            </option>
                          ))}
                        </Field>
                        {errors.gender && touched.gender && (
                          <div
                            className="font-[NetflixL] text-[13px] ml-[6px]"
                            style={{ color: "red" }}
                          >
                            {errors.gender}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div className="grid gap-1 font-[NetflixR]">
                        <label className="text-[14px]" htmlFor="interest">
                          Pick an Interest
                        </label>
                        <div className="border-2 rounded-[10px] p-2 h-[80px] overflow-y-auto font-[NetflixL]">
                          {myInterests.map((item) => (
                            <label
                              key={item.key}
                              className="text-sm flex items-center"
                            >
                              <input
                                type="checkbox"
                                name="interest"
                                value={item.key}
                                checked={values.interest.includes(item.key)}
                                onChange={(event) => {
                                  const selectedValues = [...values.interest];
                                  if (event.target.checked) {
                                    selectedValues.push(event.target.value);
                                  } else {
                                    const index = selectedValues.indexOf(
                                      event.target.value
                                    );
                                    if (index > -1) {
                                      selectedValues.splice(index, 1);
                                    }
                                  }
                                  setFieldValue("interest", selectedValues);
                                }}
                                className="mr-2"
                              />
                              <span>{item.name}</span>
                            </label>
                          ))}
                        </div>
                        {errors.interest && touched.interest && (
                          <div
                            className="font-[NetflixL] text-[13px] ml-[6px]"
                            style={{ color: "red" }}
                          >
                            {errors.interest}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-2 font-[NetflixR]">
                      <Textarea
                        type="text"
                        label="About"
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder="Describe Yourself"
                        disableAnimation
                        name="about"
                        disableAutosize
                        value={values.about}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.about && errors.about}
                        color={
                          touched.agaboute && errors.about
                            ? "danger"
                            : "success"
                        }
                        errorMessage={
                          touched.about && errors.about ? errors.about : ""
                        }
                        classNames={{
                          base: "",
                          input: "resize-y min-h-[40px]",
                          label: "text-[#0a0a0a]",
                        }}
                      />
                    </div>

                    <hr className="w-full border-gray-300 mt-4 mb-4" />

                    <CardTitle className="text-xl font-[NetflixB]">
                      Update Your Photo
                    </CardTitle>
                    <CardDescription className="font-[NetflixL] mt-[-8px]">
                      This Photo set on your Card
                    </CardDescription>

                    <div className="grid gap-4">
                      <div className="grid">
                        <div className="max-w-[240px] h-[320px] rounded-[10px] cursor-pointer mx-auto">
                          <Image
                            isZoomed
                            className="h-[320px] w-[240px] object-cover"
                            alt="NextUI Fruit Image with Zoom"
                            src={photoUrl}
                          />
                        </div>
                      </div>
                      <div className="grid gap-2 mt-2 font-[NetflixR]">
                        <Button
                          className="bg-[#e50914] text-white"
                          endContent={<GalleryIcon />}
                          onClick={triggerPictureInput}
                        >
                          <input
                            type="file"
                            id="uploadPicture"
                            className="hidden"
                            accept="image/*"
                            onChange={handlePictureUpload}
                          />
                          Update Photo
                        </Button>
                      </div>
                    </div>

                    {isUploadingPhoto && <Spinner size="lg" color="danger" />}

                    <hr className="w-full border-gray-300 mt-4 mb-4" />

                    <CardTitle className="text-xl font-[NetflixB]">
                      Additional Information
                    </CardTitle>
                    <CardDescription className="font-[NetflixL] mt-[-8px]">
                      Enter your Address information
                    </CardDescription>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="grid gap-2 font-[NetflixR]">
                        <Select
                          className=""
                          label="Country"
                          variant="bordered"
                          labelPlacement="outside"
                          placeholder="India"
                          isDisabled
                        >
                          {Country.map((country) => (
                            <SelectItem
                              key={country.key}
                              startContent={country.startContent}
                            >
                              {country.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                      <div className="grid gap-2 font-[NetflixR]">
                        <Input
                          label="State"
                          type="text"
                          name="address.state"
                          labelPlacement="outside"
                          variant="bordered"
                          placeholder="State"
                          className=""
                          value={values.address.state}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={
                            touched.address?.state && errors.address?.state
                          }
                          color={
                            touched.address?.state && errors.address?.state
                              ? "danger"
                              : "success"
                          }
                          errorMessage={
                            touched.address?.state && errors.address?.state
                              ? errors.address?.state
                              : ""
                          }
                          classNames={{
                            label: "text-[#0a0a0a]",
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2 font-[NetflixR]">
                        <Input
                          label="City"
                          type="text"
                          name="address.city"
                          labelPlacement="outside"
                          variant="bordered"
                          placeholder="City"
                          className=""
                          value={values.address.city}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={
                            touched.address?.city && errors.address?.city
                          }
                          color={
                            touched.address?.city && errors.address?.city
                              ? "danger"
                              : "success"
                          }
                          errorMessage={
                            touched.address?.city && errors.address?.city
                              ? errors.address?.city
                              : ""
                          }
                          classNames={{
                            label: "text-[#0a0a0a]",
                          }}
                        />
                      </div>
                      <div className="grid gap-2 font-[NetflixR]">
                        <Input
                          type="number"
                          label="Pin Code"
                          labelPlacement="outside"
                          placeholder="Pin Code"
                          variant="bordered"
                          name="address.pincode"
                          value={values.address.pincode}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={
                            touched.address?.pincode && errors.address?.pincode
                          }
                          color={
                            touched.address?.pincode && errors.address?.pincode
                              ? "danger"
                              : "success"
                          }
                          errorMessage={
                            touched.address?.pincode && errors.address?.pincode
                              ? errors.address?.pincode
                              : ""
                          }
                          classNames={{
                            label: "text-[#0a0a0a]",
                          }}
                        />
                      </div>
                    </div>

                    <Modal
                      size="sm"
                      isOpen={isOpen}
                      onClose={onClose}
                      backdrop="opaque"
                    >
                      <ModalContent>
                        <ModalHeader className="flex flex-col gap-1 font-[NetflixB]">
                          Problem While Updating the profile
                        </ModalHeader>
                        <ModalBody className="font-[NetflixL]">
                          <p>
                            Don't worry try again later and we resolve that
                            problem as soon as possible
                          </p>
                        </ModalBody>
                        <ModalFooter>
                          <Button onClick={onClose} className="font-[NetflixR]">
                            Close
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>

                    <Button
                      type="submit"
                      className="w-full font-[NetflixR] text-white bg-[#e50914] hover:bg-[#e64e4e] rounded-[10px]"
                      isLoading={isSubmitting || isLoading}
                      isDisabled={isSubmitting || isLoading}
                    >
                      {isLoading ? "Updateing..." : "Update"}
                    </Button>
                  </div>
                </CardContent>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </ScrollShadow>
  );
};

export default UpateProfile;
