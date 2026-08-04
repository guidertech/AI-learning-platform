import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import DeviceViewer from "@/components/DeviceViewer";
import { createClient } from "@/lib/supabase/server";

type ProfileSetupPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function ProfileSetupPage({
  searchParams,
}: ProfileSetupPageProps) {
  /*
   * Server par current logged-in user check karein.
   */
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  /*
   * User login nahi hai to profile setup nahi
   * khol sakta.
   */
  if (userError || !user) {
    redirect("/login");
  }

  /*
   * Check karein ki profile pehle se bani hui hai
   * ya nahi.
   */
  const {
    data: existingProfile,
    error: profileCheckError,
  } = await supabase
    .from("users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileCheckError) {
    console.error(
      "Profile check failed:",
      profileCheckError
    );

    throw new Error(
      "Student profile could not be checked."
    );
  }

  /*
   * Existing profile wale user ko onboarding
   * dobara nahi dikhani.
   */
  if (existingProfile) {
    redirect("/dashboard");
  }

  /*
   * Google account se student ka default name.
   */
  const defaultName =
    typeof user.user_metadata?.full_name ===
      "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name ===
        "string"
        ? user.user_metadata.name
        : "";

  const userEmail = user.email || "";

  const params = await searchParams;
  const formError = getErrorMessage(
    params.error
  );

  /*
   * Inline Server Action:
   * Ye function form submit hone par sirf server
   * par execute hoga.
   */
  async function saveProfile(
    formData: FormData
  ) {
    "use server";

    /*
     * Form values read karein.
     */
    const fullName = String(
      formData.get("fullName") ?? ""
    ).trim();

    const currentClass = Number(
      formData.get("currentClass")
    );

    const school = String(
      formData.get("school") ?? ""
    ).trim();


    const age = Number(
      formData.get("age")
    );

    /*
     * Server-side validation.
     */
    if (
      fullName.length < 2 ||
      fullName.length > 100
    ) {
      redirect(
        "/profile-setup?error=invalid_name"
      );
    }

    if (
      !Number.isInteger(currentClass) ||
      currentClass < 1 ||
      currentClass > 8
    ) {
      redirect(
        "/profile-setup?error=invalid_class"
      );
    }

    if (
      !Number.isInteger(age) ||
      age < 5 ||
      age > 25
    ) {
      redirect(
        "/profile-setup?error=invalid_age"
      );
    }


    /*
     * Server Action ke andar naya server client
     * current request cookies ke saath banega.
     */
    const actionSupabase =
      await createClient();

    /*
     * User ID ko form se nahi lena.
     * Authenticated session se verified user lena.
     */
    const {
      data: { user: actionUser },
      error: actionUserError,
    } =
      await actionSupabase.auth.getUser();

    if (actionUserError || !actionUser) {
      redirect("/login");
    }

    /*
     * Dobara check karein ki profile already
     * create to nahi hui.
     */
    const {
      data: profileAlreadyExists,
      error: existingProfileError,
    } = await actionSupabase
      .from("users")
      .select("id")
      .eq("id", actionUser.id)
      .maybeSingle();

    if (existingProfileError) {
      console.error(
        "Existing profile check failed:",
        existingProfileError
      );

      redirect(
        "/profile-setup?error=profile_check_failed"
      );
    }

    if (profileAlreadyExists) {
      redirect("/dashboard");
    }


    /*
     * Profile row insert karein.
     */
    const { error: insertError } =
      await actionSupabase
        .from("users")
        .insert({
          id: actionUser.id,
          email: actionUser.email,
          full_name: fullName,
          class_id: currentClass,
          school: school || null,
          age,
          profile_completed: true,
        });

    if (insertError) {
      console.error(
        "Profile insert failed:",
        insertError
      );

      /*
       * PostgreSQL 23505:
       * Same primary key ki profile pehle se
       * create ho chuki hai.
       */
      if (insertError.code === "23505") {
        redirect("/dashboard");
      }

      redirect(
        "/profile-setup?error=save_failed"
      );
    }

    /*
     * Dashboard ka cached data refresh karein.
     */
    revalidatePath("/dashboard");

    /*
     * Successful profile creation.
     */
    redirect("/dashboard");
  }

  return (
    <DeviceViewer
      title="Profile Personalization"
      deviceType="MOBILE"
    >
      <main className="h-full min-h-screen w-full flex flex-col justify-between px-margin-page py-10 bg-white">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold text-primary tracking-tight">
            Create your Profile
          </h1>

          <p className="text-xs text-on-surface-variant leading-relaxed">
            Maya will personalize study goals and
            Socratic prompts based on your grade.
          </p>
        </div>

        {/* Profile Form */}
        <form
          action={saveProfile}
          className="flex-grow flex flex-col justify-between mt-8 select-none"
        >
          <div className="space-y-4">
            {/* Email (Read-only) */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-[10px] font-bold text-outline uppercase tracking-wider pl-1"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={userEmail}
                readOnly
                className="w-full h-11 px-4 rounded-xl bg-slate-100 border border-outline-variant/20 focus:outline-none text-xs font-semibold text-on-surface-variant cursor-not-allowed"
              />
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <label
                htmlFor="fullName"
                className="text-[10px] font-bold text-outline uppercase tracking-wider pl-1"
              >
                Student Full Name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                defaultValue={defaultName}
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-outline-variant/20 focus:outline-none focus:border-primary/50 text-xs font-semibold"
                placeholder="Enter your full name"
              />
            </div>

            {/* Grade */}
            <div className="space-y-1">
              <label
                htmlFor="currentClass"
                className="text-[10px] font-bold text-outline uppercase tracking-wider pl-1"
              >
                Current Class/Grade
              </label>

              <select
                id="currentClass"
                name="currentClass"
                defaultValue="5"
                required
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-outline-variant/20 focus:outline-none focus:border-primary/50 text-xs font-semibold"
              >
                {Array.from(
                  { length: 8 },
                  (_, index) => index + 1
                ).map((grade) => (
                  <option
                    key={grade}
                    value={grade}
                  >
                    Grade {grade}
                  </option>
                ))}
              </select>
            </div>

            {/* School */}
            <div className="space-y-1">
              <label
                htmlFor="school"
                className="text-[10px] font-bold text-outline uppercase tracking-wider pl-1"
              >
                School Name
              </label>

              <input
                id="school"
                name="school"
                type="text"
                maxLength={150}
                autoComplete="organization"
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-outline-variant/20 focus:outline-none focus:border-primary/50 text-xs font-semibold"
                placeholder="Enter your school name"
              />
            </div>

            {/* Age */}
            <div className="space-y-1">
              <label
                htmlFor="age"
                className="text-[10px] font-bold text-outline uppercase tracking-wider pl-1"
              >
                Age
              </label>

              <input
                id="age"
                name="age"
                type="number"
                required
                min={5}
                max={25}
                inputMode="numeric"
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-outline-variant/20 focus:outline-none focus:border-primary/50 text-xs font-semibold"
                placeholder="10"
              />
            </div>


            {/* Validation/Error Message */}
            {formError && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700"
              >
                {formError}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-12 mt-10 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md bg-primary text-white cursor-pointer active:scale-95 hover:bg-primary-container"
          >
            <span>
              Generate Study Dashboard
            </span>

            <span className="material-symbols-outlined text-[16px]">
              arrow_right_alt
            </span>
          </button>
        </form>
      </main>
    </DeviceViewer>
  );
}

/*
 * Query parameter ko readable message mein
 * convert karta hai.
 */
function getErrorMessage(
  errorCode?: string
): string | null {
  switch (errorCode) {
    case "invalid_name":
      return "Please enter a valid student name between 2 and 100 characters.";

    case "invalid_class":
      return "Please select a class between Grade 1 and Grade 8.";

    case "invalid_age":
      return "Please enter an age between 5 and 25 years.";


    case "profile_check_failed":
      return "Your existing profile could not be checked. Please try again.";

    case "save_failed":
      return "Your profile could not be saved. Please try again.";

    default:
      return null;
  }
}
