"use client";

import type React from "react";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BadgePreview } from "@/components/badge-preview";
import { Download, Upload } from "lucide-react";

export function BadgeGenerator() {
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState({ name: "", place: "", image: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|png)$/)) {
        setErrors((prev) => ({
          ...prev,
          image: "Only JPEG and PNG images are allowed",
        }));
        return;
      }

      setErrors((prev) => ({ ...prev, image: "" }));

      // Create object URL for preview
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleDownload = () => {
    const svgData = generateExportSVG();
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `badge-${name || "participant"}.svg`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = async () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Final badge size
    canvas.width = 1080;
    canvas.height = 1440;

    /* ========= 1. Draw USER IMAGE (BACKGROUND, CONTAIN) ========= */
    if (imageUrl) {
      const userImg = new Image();
      userImg.src = imageUrl;
      await new Promise((resolve) => (userImg.onload = resolve));

      // Fit image inside full badge WITHOUT zoom
      const scale = Math.min(
        canvas.width / userImg.width,
        canvas.height / userImg.height
      );

      const drawW = userImg.width * scale;
      const drawH = userImg.height * scale;

      const offsetX = (canvas.width - drawW) / 2;
      const offsetY = (canvas.height - drawH) / 2;

      ctx.drawImage(userImg, offsetX, offsetY, drawW, drawH);
    }

    /* ========= 2. Draw SVG TEMPLATE ON TOP ========= */
    const bg = new Image();
    bg.src = "/images/main-20svg.svg";
    await new Promise((resolve) => (bg.onload = resolve));

    ctx.drawImage(bg, 0, 0, 1080, 1440);

    /* ========= 3. Draw NAME ========= */
    ctx.fillStyle = "#000";
    ctx.font = "600 36px Arial";
    ctx.textAlign = "center";
    ctx.fillText(name || "", 365, 1265);

    /* ========= 4. Draw PLACE ========= */
    ctx.font = "700 40px Arial";
    ctx.textAlign = "left";
    ctx.fillText(place || "", 320, 1362);

    /* ========= 5. Download ========= */
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `badge-${name || "participant"}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const validateForm = () => {
    const newErrors = { name: "", place: "", image: "" };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!place.trim()) {
      newErrors.place = "Place is required";
      isValid = false;
    }

    if (!imageUrl) {
      newErrors.image = "Photo is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const generateExportSVG = () => {
    return `
<svg width="1080" height="1440" viewBox="0 0 1080 1440"
     xmlns="http://www.w3.org/2000/svg">

  <!-- Background template -->
  <image href="${window.location.origin}/images/main-20svg.svg"
         x="0" y="0" width="1080" height="1440"/>

  <!-- User image -->
  ${
    imageUrl
      ? `<image href="${imageUrl}"
          x="125" y="188"
          width="795.254" height="660.895"
          preserveAspectRatio="xMidYMid slice"/>`
      : ""
  }

  <!-- Name -->
  <text x="365" y="1265"
        text-anchor="middle"
        font-size="36"
        font-weight="600"
        fill="#000">
    ${name}
  </text>

  <!-- Place -->
  <text x="320" y="1362"
        font-size="40"
        font-weight="700"
        fill="#000">
    ${place}
  </text>

</svg>
`;
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3 text-balance">
          Event Badge Generator
        </h1>
        <p className="text-muted-foreground text-lg">
          Create professional participant badges in seconds
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Form Section */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Badge Details</CardTitle>
              <CardDescription>
                Enter participant information to generate the badge
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="photo" className="text-base font-semibold">
                  Participant Photo
                </Label>
                <div className="flex flex-col gap-3">
                  <input
                    ref={fileInputRef}
                    id="photo"
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-auto py-6 border-2 border-dashed hover:border-primary hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <div className="text-center">
                        <p className="font-semibold text-foreground">
                          {imageUrl ? "Change Photo" : "Upload Photo"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          JPEG or PNG only
                        </p>
                      </div>
                    </div>
                  </Button>
                  {imageUrl && (
                    <div className="relative w-32 h-32 mx-auto rounded-lg overflow-hidden border-2 border-border">
                      <img
                        src={imageUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {errors.image && (
                    <p className="text-sm text-destructive font-medium">
                      {errors.image}
                    </p>
                  )}
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter participant name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  className={`h-12 text-base ${
                    errors.name ? "border-destructive" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Place Input */}
              <div className="space-y-2">
                <Label htmlFor="place" className="text-base font-semibold">
                  Location / Place
                </Label>
                <Input
                  id="place"
                  type="text"
                  placeholder="Enter city or location"
                  value={place}
                  onChange={(e) => {
                    setPlace(e.target.value);
                    setErrors((prev) => ({ ...prev, place: "" }));
                  }}
                  className={`h-12 text-base ${
                    errors.place ? "border-destructive" : ""
                  }`}
                />
                {errors.place && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.place}
                  </p>
                )}
              </div>

              {/* Download Buttons */}
              <div className="pt-4 space-y-3">
                {/* <Button
                  disabled
                  onClick={handleDownload}
                  // disabled={!name || !place || !imageUrl}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download SVG
                </Button> */}
                <Button
                  onClick={handleDownloadPNG}
                  disabled={!name || !place || !imageUrl}
                  variant="outline"
                  className="w-full h-12 font-semibold bg-transparent"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download PNG
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Live Preview</CardTitle>
              <CardDescription>Your badge updates in real-time</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <BadgePreview name={name} place={place} imageUrl={imageUrl} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
