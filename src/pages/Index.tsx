import TeacherProfileForm from "@/components/TeacherProfileForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">
          Create Your Teacher Profile
        </h1>
        <TeacherProfileForm />
      </div>
    </div>
  );
};

export default Index;