"use client";

import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import {
  MapPin,
  User,
  Phone,
  Home,
  Building2,
  MapPinned,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import axios from "axios";

const AddAddress = () => {
  const { getToken, router } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [address, setAddress] = useState({
    fullName: "",
    phoneNumber: "",
    pincode: "",
    area: "",
    city: "",
    state: "",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/user/add-address",
        { address },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        toast.success(data.message);
        router.push("/checkout");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Add New Address
                </h1>
                <p className="text-gray-600 mt-1">
                  Enter your delivery address details
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <form onSubmit={onSubmitHandler} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  Personal Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      required
                      value={address.fullName}
                      onChange={handleChange}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber" className="text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="Enter phone number"
                      required
                      value={address.phoneNumber}
                      onChange={handleChange}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Address Details */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Home className="h-5 w-5 text-purple-600" />
                  Address Details
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pincode" className="text-gray-700">
                      PIN Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      type="text"
                      placeholder="Enter PIN code"
                      required
                      value={address.pincode}
                      onChange={handleChange}
                      className="mt-1.5"
                      maxLength="6"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-gray-700">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="Enter city"
                      required
                      value={address.city}
                      onChange={handleChange}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="area" className="text-gray-700">
                    Area / Locality <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="area"
                    name="area"
                    type="text"
                    placeholder="Enter area, street, sector, village"
                    required
                    value={address.area}
                    onChange={handleChange}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="state" className="text-gray-700">
                    State <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    type="text"
                    placeholder="Enter state"
                    required
                    value={address.state}
                    onChange={handleChange}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12 cursor-pointer"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block mr-2 animate-spin">⏳</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <MapPinned className="mr-2 h-5 w-5" />
                      Save Address
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <div className="flex-shrink-0">
              <div className="bg-blue-100 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                Why do we need your address?
              </h3>
              <p className="text-sm text-blue-800">
                Your address helps us deliver your orders accurately and
                estimate delivery times. We keep your information secure and
                never share it with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAddress;
